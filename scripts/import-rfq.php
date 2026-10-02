<?php
/** Local-only P006 Page importer; preserves editor changes and foreign pages. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) {
    WP_CLI::error('Local-only P006 import refused.');
}
require_once __DIR__.'/inc/local-page-seed.php';
$path = '/workspace/local/p006-page.json';
if (!is_file($path)) WP_CLI::error('Missing private P006 payload.');
$source = json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
if (!is_array($source) || ($source['stable_id'] ?? '')!=='P006' || ($source['slug'] ?? '')!=='rfq') {
    WP_CLI::error('P006 identity mismatch.');
}
$id = ge_seed_local_page($source);
if (is_wp_error($id)) WP_CLI::error($id->get_error_code().': '.$id->get_error_message());
WP_CLI::line(wp_json_encode(['page_id'=>$id,'url'=>get_permalink($id)]));
