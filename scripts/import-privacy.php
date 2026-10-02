<?php
/** Local-only P011 Page importer with stable identity and editor preservation. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) {
    WP_CLI::error('Local-only P011 import refused.');
}
require_once __DIR__.'/inc/local-page-seed.php';
$path = '/workspace/local/p011-page.json';
if (!is_file($path)) WP_CLI::error('Missing private P011 payload.');
$source = json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
if (!is_array($source) || ($source['stable_id'] ?? '')!=='P011' || ($source['slug'] ?? '')!=='privacy') {
    WP_CLI::error('P011 identity mismatch.');
}
$id = ge_seed_local_page($source);
if (is_wp_error($id)) WP_CLI::error($id->get_error_code().': '.$id->get_error_message());
update_post_meta($id,'_ge_seo_title',$source['seo']['title']);
update_post_meta($id,'_ge_seo_description',$source['seo']['description']);
WP_CLI::line(wp_json_encode(['page_id'=>$id,'url'=>get_permalink($id)]));
