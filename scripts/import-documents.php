<?php
/** Explicit local P005 import. No menus, media, mail or other page writes. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    home_url('/') !== 'http://127.0.0.1:18086/') WP_CLI::error('Wrong P005 target.');
require_once __DIR__.'/inc/local-page-seed.php';
$file = '/workspace/local/p005-page.json';
if (!is_file($file)) WP_CLI::error('Missing private P005 payload.');
$source = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
if (($source['stable_id'] ?? '') !== 'P005' || ($source['slug'] ?? '') !== 'documents' ||
    ($source['route'] ?? '') !== '/documents/' || ($source['home'] ?? '') !== home_url('/') ||
    ($source['template'] ?? '') !== 'page-templates/sectioned-page.php' ||
    !is_file(get_theme_file_path('/page-templates/sectioned-page.php')))
    WP_CLI::error('Invalid P005 payload or template.');
foreach (['title', 'description'] as $field) {
    if (!is_string($source['seo'][$field] ?? null) || $source['seo'][$field] === '')
        WP_CLI::error('Missing P005 search presentation.');
}
$route_owner = get_page_by_path('documents', OBJECT, 'page');
if ($route_owner && get_post_meta($route_owner->ID, '_ge_page_id', true) !== 'P005')
    WP_CLI::error('P005 route collides with an existing page.');
$matches = get_posts(['post_type' => 'page', 'post_status' => 'any', 'numberposts' => 2,
    'meta_key' => '_ge_page_id', 'meta_value' => 'P005']);
if (count($matches) > 1) WP_CLI::error('Duplicate P005 identity.');
if ($matches) {
    $id = $matches[0]->ID;
    $current_seo = hash('sha256', wp_json_encode([
        get_post_meta($id, '_ge_seo_title', true),
        get_post_meta($id, '_ge_seo_description', true)]));
    $managed_seo = get_post_meta($id, '_ge_managed_seo_state', true);
    if (!$managed_seo || !hash_equals($managed_seo, $current_seo))
        WP_CLI::error('Edited P005 SEO values require reconciliation.');
    $current_template = get_post_meta($id, '_wp_page_template', true);
    $managed_template = get_post_meta($id, '_ge_managed_template_state', true);
    if (!$managed_template || !hash_equals($managed_template, hash('sha256', $current_template)))
        WP_CLI::error('Edited P005 template requires reconciliation.');
}
global $wpdb;
if ((string)$wpdb->get_var("SELECT GET_LOCK('ge-local-page-writer',0)") !== '1')
    WP_CLI::error('Another local DB writer holds the import lock.');
try {
    $id = ge_seed_local_page($source);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    update_post_meta($id, '_ge_seo_title', $source['seo']['title']);
    update_post_meta($id, '_ge_seo_description', $source['seo']['description']);
    update_post_meta($id, '_ge_managed_seo_state', hash('sha256', wp_json_encode([
        $source['seo']['title'], $source['seo']['description']])));
    update_post_meta($id, '_wp_page_template', $source['template']);
    update_post_meta($id, '_ge_managed_template_state', hash('sha256', $source['template']));
    update_post_meta($id, '_ge_source_hash', $source['source_hash']);
    WP_CLI::line(wp_json_encode(['page_id' => $id, 'url' => get_permalink($id),
        'template' => get_post_meta($id, '_wp_page_template', true)]));
} finally {
    $wpdb->get_var("SELECT RELEASE_LOCK('ge-local-page-writer')");
}
