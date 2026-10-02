<?php
/** One-time P013 publication to the identified public IP WordPress. */
if (!defined('WP_CLI') || !WP_CLI) return;
$mode = $args[0] ?? '';
if (!in_array($mode, ['preflight', 'publish'], true)) WP_CLI::error('Expected preflight or publish.');
if (home_url('/') !== 'https://152.70.109.64/' || site_url('/') !== 'https://152.70.109.64/') WP_CLI::error('Public IP WordPress identity mismatch.');
$file = '/workspace/import/p013-public.json';
if (!is_file($file)) WP_CLI::error('P013 payload missing.');
$source = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
if (($source['stable_id'] ?? null) !== 'P013' || ($source['slug'] ?? null) !== 'black-masterbatch' ||
    ($source['route'] ?? null) !== '/products/black-masterbatch/' || ($source['home'] ?? null) !== home_url('/') ||
    ($source['status'] ?? null) !== 'publish' || ($source['contact_mode'] ?? null) !== 'email' ||
    ($source['template'] ?? null) !== 'page-templates/sectioned-page.php' ||
    !is_file(get_theme_file_path('/page-templates/sectioned-page.php')) ||
    !is_file(get_theme_file_path('/assets/black-masterbatch.css'))) WP_CLI::error('P013 source or theme mismatch.');
foreach (['title', 'content', 'source_hash'] as $field) {
    if (!is_string($source[$field] ?? null) || $source[$field] === '') WP_CLI::error('Missing P013 field.');
}
foreach (['title', 'description'] as $field) {
    if (!is_string($source['seo'][$field] ?? null) || $source['seo'][$field] === '') WP_CLI::error('Missing P013 SEO field.');
}
if (str_contains($source['content'], '127.0.0.1') || str_contains($source['content'], ':18086') ||
    !has_blocks($source['content'])) WP_CLI::error('P013 block content or URLs invalid.');
$existing = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,
    'meta_key'=>'_ge_page_id','meta_value'=>'P013']);
if ($existing || get_page_by_path('black-masterbatch', OBJECT, 'page') ||
    get_page_by_path('products/black-masterbatch', OBJECT, 'page')) WP_CLI::error('P013 identity or route collision; preserve existing content for review.');
if ($mode === 'preflight') { WP_CLI::success('P013 target, source, theme and collision checks passed.'); return; }
$id = wp_insert_post(wp_slash([
    'post_type'=>'page', 'post_status'=>'publish', 'post_name'=>'black-masterbatch',
    'post_title'=>$source['title'], 'post_content'=>$source['content'],
]), true);
if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
$saved = get_post($id);
if ($saved->post_name !== 'black-masterbatch') { wp_delete_post($id, true); WP_CLI::error('Slug changed.'); }
update_post_meta($id, '_ge_page_id', 'P013');
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
update_post_meta($id, '_ge_local_contact_mode', 'email');
flush_rewrite_rules(false);
if (get_permalink($id) !== home_url('/products/black-masterbatch/')) WP_CLI::error('Published, but permalink mismatch; inspect page ID '.$id);
WP_CLI::success('Published P013 at '.get_permalink($id).' (ID '.$id.').');
