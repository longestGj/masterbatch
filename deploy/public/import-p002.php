<?php
/** One-time P002 publication to the identified public IP WordPress. */
if (!defined('WP_CLI') || !WP_CLI) return;
$mode = $args[0] ?? '';
if (!in_array($mode, ['preflight', 'publish'], true)) WP_CLI::error('Expected preflight or publish.');
if (home_url('/') !== 'https://152.70.109.64/' || site_url('/') !== 'https://152.70.109.64/') WP_CLI::error('Public IP WordPress identity mismatch.');
$file = '/workspace/import/p002-public.json';
if (!is_file($file)) WP_CLI::error('P002 payload missing.');
$source = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
if (($source['stable_id'] ?? null) !== 'P002' || ($source['slug'] ?? null) !== 'products' ||
    ($source['route'] ?? null) !== '/products/' || ($source['home'] ?? null) !== home_url('/') ||
    ($source['status'] ?? null) !== 'publish' || ($source['photo_id'] ?? null) !== 13 ||
    ($source['template'] ?? null) !== 'page-templates/sectioned-page.php' ||
    !is_file(get_theme_file_path('/page-templates/sectioned-page.php')) ||
    !is_file(get_theme_file_path('/assets/products.css'))) WP_CLI::error('P002 source or theme mismatch.');
foreach (['title', 'content', 'source_hash'] as $field) {
    if (!is_string($source[$field] ?? null) || $source[$field] === '') WP_CLI::error('Missing P002 field.');
}
foreach (['title', 'description'] as $field) {
    if (!is_string($source['seo'][$field] ?? null) || $source['seo'][$field] === '') WP_CLI::error('Missing P002 SEO field.');
}
if (str_contains($source['content'], '127.0.0.1') || str_contains($source['content'], ':18086') ||
    !has_blocks($source['content']) || !str_contains($source['content'], home_url('/wp-content/uploads/'))) WP_CLI::error('P002 blocks or media URL invalid.');
$media = get_post(13);
if (!$media || $media->post_type !== 'attachment' ||
    get_post_meta(13, '_ge_source_owner', true) !== 'ge-masterbatch' ||
    get_post_meta(13, '_ge_asset_identity', true) !== 'granules:2911cff540042acc27f0cdc793d10b4d4e45d389b8b6100357ee06d3b97ad858' ||
    !is_file(get_attached_file(13))) WP_CLI::error('P002 media identity mismatch.');
$existing = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,
    'meta_key'=>'_ge_page_id','meta_value'=>'P002']);
if ($existing || get_page_by_path('products', OBJECT, 'page')) WP_CLI::error('P002 identity or route collision; preserve existing content for review.');
if ($mode === 'preflight') { WP_CLI::success('P002 target, source, media, theme and collision checks passed.'); return; }
$id = wp_insert_post(wp_slash([
    'post_type'=>'page', 'post_status'=>'publish', 'post_name'=>'products',
    'post_title'=>$source['title'], 'post_content'=>$source['content'],
]), true);
if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
$saved = get_post($id);
if ($saved->post_name !== 'products') { wp_delete_post($id, true); WP_CLI::error('Slug changed.'); }
update_post_meta($id, '_ge_page_id', 'P002');
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
if (get_permalink($id) !== home_url('/products/')) WP_CLI::error('Published, but permalink mismatch; inspect page ID '.$id);
WP_CLI::success('Published P002 at '.get_permalink($id).' (ID '.$id.').');
