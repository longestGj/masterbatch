<?php
/** Emit installed Core block scripts for a local, transient serializer document. No post editor or database writes. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true || home_url('/') !== 'http://127.0.0.1:18086/') WP_CLI::error('Wrong block serializer target.');
wp_enqueue_script('wp-block-library');
ob_start();
wp_print_scripts();
$scripts = ob_get_clean();
WP_CLI::line(wp_json_encode(['html'=>'<!doctype html><html><head><meta charset="utf-8"></head><body>'.$scripts.'</body></html>']));
