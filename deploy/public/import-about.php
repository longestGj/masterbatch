<?php
/** Scoped, one-time P003 publication to the identified public IP WordPress. */
if (!defined('WP_CLI') || !WP_CLI) return;

$mode = $args[0] ?? '';
if (!in_array($mode, ['preflight', 'publish'], true)) WP_CLI::error('Expected preflight or publish.');
if (home_url('/') !== 'https://152.70.109.64/' || site_url('/') !== 'https://152.70.109.64/') {
    WP_CLI::error('Public IP WordPress identity mismatch.');
}

$file = '/workspace/import/p003-public.json';
if (!is_file($file)) WP_CLI::error('About payload missing.');
$source = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
if (($source['stable_id'] ?? null) !== 'P003' || ($source['slug'] ?? null) !== 'about' ||
    ($source['home'] ?? null) !== home_url('/') || ($source['status'] ?? null) !== 'publish' ||
    ($source['template'] ?? null) !== 'page-templates/sectioned-page.php' ||
    !is_file(get_theme_file_path('/page-templates/sectioned-page.php'))) {
    WP_CLI::error('About source or template mismatch.');
}
foreach (['title', 'content', 'source_hash'] as $field) {
    if (!is_string($source[$field] ?? null) || $source[$field] === '') WP_CLI::error('Missing About source field.');
}
foreach (['title', 'description'] as $field) {
    if (!is_string($source['seo'][$field] ?? null) || $source['seo'][$field] === '') WP_CLI::error('Missing About SEO field.');
}
if (str_contains($source['content'], '127.0.0.1') || str_contains($source['content'], ':18086') ||
    !has_blocks($source['content'])) WP_CLI::error('About block content or URLs are invalid.');
if (($source['media'] ?? null) !== [12, 13, 14]) WP_CLI::error('About media IDs changed.');

$identities = [
    12 => 'factory:4f4d17426e5f841dd7bcf81cd5b6fad3bbac7214d2a15449d97f368ff238fed2',
    13 => 'granules:2911cff540042acc27f0cdc793d10b4d4e45d389b8b6100357ee06d3b97ad858',
    14 => 'equipment:1155c14b2e2e99fa01268135ea3aea91bbfa8d54ab4a58730a3d62f982d27fc1',
];
foreach ($identities as $id => $identity) {
    $media = get_post($id);
    if (!$media || $media->post_type !== 'attachment' ||
        get_post_meta($id, '_ge_source_owner', true) !== 'ge-masterbatch' ||
        get_post_meta($id, '_ge_asset_identity', true) !== $identity ||
        !is_file(get_attached_file($id))) WP_CLI::error('About media identity mismatch: '.$id);
}

$existing = get_posts(['post_type' => 'page', 'post_status' => 'any', 'numberposts' => 2,
    'meta_key' => '_ge_page_id', 'meta_value' => 'P003']);
if ($existing || get_page_by_path('about', OBJECT, 'page')) WP_CLI::error('About page already exists; preserve it for review.');

if ($mode === 'preflight') {
    WP_CLI::success('P003 target, source, media, template and collision checks passed.');
    return;
}

$id = wp_insert_post(wp_slash([
    'post_type' => 'page', 'post_status' => 'publish', 'post_name' => 'about',
    'post_title' => $source['title'], 'post_content' => $source['content'],
]), true);
if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
$saved = get_post($id);
if ($saved->post_name !== 'about') {
    wp_delete_post($id, true);
    WP_CLI::error('WordPress did not preserve the About slug.');
}
update_post_meta($id, '_ge_page_id', 'P003');
update_post_meta($id, '_ge_source_owner', 'ge-masterbatch');
update_post_meta($id, '_ge_source_hash', $source['source_hash']);
update_post_meta($id, '_ge_managed_state', hash('sha256', wp_json_encode([
    $saved->post_title, $saved->post_name, $saved->post_status, $saved->post_content])));
update_post_meta($id, '_ge_seo_title', $source['seo']['title']);
update_post_meta($id, '_ge_seo_description', $source['seo']['description']);
update_post_meta($id, '_ge_managed_seo_state', hash('sha256', wp_json_encode([
    $source['seo']['title'], $source['seo']['description']])));
update_post_meta($id, '_wp_page_template', $source['template']);
update_post_meta($id, '_ge_managed_template_state', hash('sha256', $source['template']));

WP_CLI::success('Published P003 at '.get_permalink($id).' (ID '.$id.').');
