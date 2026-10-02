<?php
/** Owner-authorized single model-cell link edit; preserve all other saved content. */
if (!defined('WP_CLI') || !WP_CLI) return;
$target = $args[0] ?? '';
$expected_home = $target === 'public' ? 'https://152.70.109.64/' : ($target === 'local' ? 'http://127.0.0.1:18086/' : '');
if (!$expected_home || home_url('/') !== $expected_home || site_url('/') !== $expected_home) WP_CLI::error('P013 link-edit target mismatch.');
global $wpdb;
if ((string)$wpdb->get_var("SELECT GET_LOCK('ge-page-link-writer',0)") !== '1') WP_CLI::error('Another link writer is active.');
try {
    $pages = [];
    foreach (['P013','P017'] as $stable) {
        $found = get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>2,'meta_key'=>'_ge_page_id','meta_value'=>$stable]);
        if (count($found) !== 1 || get_post_meta($found[0]->ID,'_ge_source_owner',true) !== 'ge-masterbatch') WP_CLI::error('Missing/foreign/duplicate '.$stable.' identity.');
        $pages[$stable] = $found[0];
    }
    if (get_permalink($pages['P013']) !== home_url('/products/black-masterbatch/') || get_permalink($pages['P017']) !== home_url('/products/bk020/')) WP_CLI::error('Source or destination route mismatch.');
    $id = $pages['P013']->ID;
    $before = $pages['P013']->post_content;
    $old = '<td><strong>BK020</strong></td>';
    $new = '<td><strong><a href="/products/bk020/">BK020</a></strong></td>';
    if (substr_count($before,$new) === 1 && !str_contains($before,$old)) { WP_CLI::success('BK020 model link already correct.'); return; }
    if (substr_count($before,$old) !== 1) WP_CLI::error('Unexpected BK020 cell; preserve content for inspection.');
    $after = str_replace($old,$new,$before);
    $result = wp_update_post(wp_slash(['ID'=>$id,'post_content'=>$after]),true);
    if (is_wp_error($result)) WP_CLI::error($result->get_error_message());
    if (get_post($id)->post_content !== $after) WP_CLI::error('Saved P013 content mismatch.');
    // Advance the importer baseline only when the pre-edit state was still managed.
    $old_state = hash('sha256',wp_json_encode([$pages['P013']->post_title,$pages['P013']->post_name,$pages['P013']->post_status,$before]));
    if (hash_equals($old_state,(string)get_post_meta($id,'_ge_managed_state',true))) {
        $saved = get_post($id);
        update_post_meta($id,'_ge_managed_state',hash('sha256',wp_json_encode([$saved->post_title,$saved->post_name,$saved->post_status,$saved->post_content])));
    }
    WP_CLI::success('Linked P013 BK020 cell to '.home_url('/products/bk020/').' (page '.$id.').');
} finally { $wpdb->get_var("SELECT RELEASE_LOCK('ge-page-link-writer')"); }
