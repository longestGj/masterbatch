<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) WP_CLI::error('Local-only theme checks refused.');
if (!current_theme_supports('custom-logo')) WP_CLI::error('Editable custom Logo support is missing.');
$menus = get_registered_nav_menus();
foreach (['primary','inquiry','footer-products','footer-company','footer-information'] as $location) {
    if (!isset($menus[$location])) WP_CLI::error('Missing shared menu location: '.$location);
}
if (!is_file(get_theme_file_path('/front-page.php'))) WP_CLI::error('Saved-content homepage template is missing.');
foreach (['ge-primary','ge-secondary','ge-text'] as $style) {
    if (!WP_Block_Styles_Registry::get_instance()->is_registered('core/button',$style)) WP_CLI::error('Missing native button style: '.$style);
}
if (!function_exists('ge_page_seo_head')) WP_CLI::error('Page-owned SEO rendering is missing.');
if (wp_mail('nobody@example.test','Local theme check','No sending')!==false) WP_CLI::error('Local mail protection failed.');
WP_CLI::success('Core branding, menus, button styles, homepage template, SEO hook and local mail protection passed.');
