<?php
/** Explicit, local-only P003 Core Page import. No menus, mail or other page writes. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    home_url('/') !== 'http://127.0.0.1:18086/') WP_CLI::error('Local P003 target identity check failed.');
require_once __DIR__.'/inc/local-page-seed.php';
$file = '/workspace/local/p003-page.json';
if (!is_file($file)) WP_CLI::error('Missing private P003 payload.');
$source = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
if (($source['stable_id'] ?? '') !== 'P003' || ($source['slug'] ?? '') !== 'about' ||
    ($source['home'] ?? '') !== home_url('/') ||
    ($source['template'] ?? '') !== 'page-templates/sectioned-page.php' ||
    !is_file(get_theme_file_path('/page-templates/sectioned-page.php'))) WP_CLI::error('Invalid P003 source or template.');
foreach (['title','description'] as $field) {
    if (!is_string($source['seo'][$field] ?? null) || $source['seo'][$field] === '') WP_CLI::error('Missing P003 search presentation.');
}
if (!is_array($source['media'] ?? null) || count($source['media']) !== 3) WP_CLI::error('Expected three existing owned media records.');
foreach ($source['media'] as $media_id) {
    $media = get_post($media_id);
    if (!$media || $media->post_type !== 'attachment' ||
        get_post_meta($media_id, '_ge_source_owner', true) !== 'ge-masterbatch' ||
        !get_post_meta($media_id, '_ge_asset_identity', true) ||
        !is_file(get_attached_file($media_id))) WP_CLI::error('P003 media ownership or file check failed.');
}
$matches = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,
    'meta_key'=>'_ge_page_id','meta_value'=>'P003']);
if (count($matches) > 1) WP_CLI::error('Duplicate P003 page identity.');
if ($matches) {
    $id = $matches[0]->ID;
    $current_seo = hash('sha256', wp_json_encode([
        get_post_meta($id, '_ge_seo_title', true),
        get_post_meta($id, '_ge_seo_description', true)]));
    $managed_seo = get_post_meta($id, '_ge_managed_seo_state', true);
    if (!$managed_seo || !hash_equals($managed_seo, $current_seo)) WP_CLI::error('Edited P003 SEO values require reconciliation.');
    $current_template = get_post_meta($id, '_wp_page_template', true);
    $managed_template = get_post_meta($id, '_ge_managed_template_state', true);
    if (!$managed_template || !hash_equals($managed_template, hash('sha256', $current_template))) WP_CLI::error('Edited P003 template requires reconciliation.');
}
$id = ge_seed_local_page($source);
if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
update_post_meta($id, '_ge_seo_title', $source['seo']['title']);
update_post_meta($id, '_ge_seo_description', $source['seo']['description']);
update_post_meta($id, '_ge_managed_seo_state', hash('sha256', wp_json_encode([
    $source['seo']['title'], $source['seo']['description']])));
update_post_meta($id, '_wp_page_template', $source['template']);
update_post_meta($id, '_ge_managed_template_state', hash('sha256', $source['template']));
update_post_meta($id, '_ge_source_hash', $source['source_hash']);
WP_CLI::line(wp_json_encode(['page_id'=>$id,'url'=>get_permalink($id),
    'template'=>get_post_meta($id, '_wp_page_template', true)]));
