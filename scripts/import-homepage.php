<?php
/** Explicit local P001/media/menu initialization. Not a production importer. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) WP_CLI::error('Local-only homepage initialization refused.');
require_once __DIR__.'/inc/local-page-seed.php';
function ge_local_json($name) {
    $path = '/workspace/local/'.$name;
    if (!is_file($path)) WP_CLI::error('Missing local source payload.');
    $data = json_decode(file_get_contents($path),true,512,JSON_THROW_ON_ERROR);
    if (!is_array($data)) WP_CLI::error('Invalid local source payload.');
    return $data;
}
$mode = $args[0] ?? '';
if ($mode==='media') {
    require_once ABSPATH.'wp-admin/includes/file.php';
    require_once ABSPATH.'wp-admin/includes/media.php';
    require_once ABSPATH.'wp-admin/includes/image.php';
    $images = [];
    foreach (ge_local_json('p001-assets.json') as $key=>$asset) {
        $file = '/workspace/local/assets/'.basename($asset['file']);
        if (!is_file($file)) WP_CLI::error('Missing source asset.');
        $identity = $key.':'.hash_file('sha256',$file);
        $matches = get_posts(['post_type'=>'attachment','post_status'=>'inherit','numberposts'=>2,'meta_key'=>'_ge_asset_identity','meta_value'=>$identity]);
        if (count($matches)>1) WP_CLI::error('Duplicate owned media identity.');
        if ($matches && get_post_meta($matches[0]->ID,'_ge_source_owner',true)!=='ge-masterbatch') WP_CLI::error('Foreign media identity collision.');
        if ($matches) {
            $id = $matches[0]->ID;
        } else {
            $temporary = wp_tempnam(basename($file));
            if (!$temporary || !copy($file,$temporary)) WP_CLI::error('Cannot prepare source media.');
            $id = media_handle_sideload(['name'=>basename($file),'tmp_name'=>$temporary],0,$asset['title']);
            if (is_wp_error($id)) { if (is_file($temporary)) unlink($temporary); WP_CLI::error($id->get_error_message()); }
            update_post_meta($id,'_ge_asset_identity',$identity);
            update_post_meta($id,'_ge_source_owner','ge-masterbatch');
            update_post_meta($id,'_wp_attachment_image_alt',$asset['alt']);
        }
        $image = wp_get_attachment_image_src($id,'full');
        if (!$image || !is_file(get_attached_file($id))) WP_CLI::error('Imported source media is unavailable.');
        $images[$key] = ['id'=>$id,'url'=>$image[0],'width'=>$image[1],'height'=>$image[2],
            'alt'=>get_post_meta($id,'_wp_attachment_image_alt',true)];
    }
    WP_CLI::line(wp_json_encode($images,JSON_UNESCAPED_SLASHES));
    return;
}
if ($mode!=='page') WP_CLI::error('Expected media or page mode.');
$source = ge_local_json('p001-page.json');
if (($source['stable_id'] ?? '')!=='P001') WP_CLI::error('This initializer accepts P001 only.');
$existing = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,'meta_key'=>'_ge_page_id','meta_value'=>'P001']);
if ($existing) {
    $id = $existing[0]->ID;
    $currentSEO = hash('sha256',wp_json_encode([get_post_meta($id,'_ge_seo_title',true),get_post_meta($id,'_ge_seo_description',true)]));
    $managedSEO = get_post_meta($id,'_ge_managed_seo_state',true);
    if (!$managedSEO || !hash_equals($managedSEO,$currentSEO)) WP_CLI::error('Preserve edited SEO values; explicit reconciliation is required.');
}
$initialized = get_option('ge_p001_initialized');
if (!$initialized) {
    if (get_option('show_on_front')==='page' && get_option('page_on_front')) WP_CLI::error('Existing homepage assignment is not adopted.');
    if (get_theme_mod('custom_logo') || get_option('site_icon')) WP_CLI::error('Existing branding must be reconciled before initialization.');
    $menuCheck = ge_check_local_menu_initialization(array_keys($source['menus']));
    if (is_wp_error($menuCheck)) WP_CLI::error($menuCheck->get_error_message());
}
$id = ge_seed_local_page($source);
if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
update_post_meta($id,'_ge_seo_title',$source['seo']['title']);
update_post_meta($id,'_ge_seo_description',$source['seo']['description']);
update_post_meta($id,'_ge_managed_seo_state',hash('sha256',wp_json_encode([$source['seo']['title'],$source['seo']['description']])));
if (!$initialized) {
    $locations = get_theme_mod('nav_menu_locations',[]);
    foreach ($source['menus'] as $location=>$items) {
        $menu = wp_create_nav_menu('GE '.$location);
        if (is_wp_error($menu)) WP_CLI::error($menu->get_error_message());
        update_term_meta($menu,'_ge_source_owner','ge-masterbatch');
        foreach ($items as $position=>$item) {
            $result = wp_update_nav_menu_item($menu,0,['menu-item-title'=>$item[0],'menu-item-url'=>home_url($item[1]),
                'menu-item-status'=>'publish','menu-item-type'=>'custom','menu-item-position'=>$position+1]);
            if (is_wp_error($result)) WP_CLI::error($result->get_error_message());
        }
        $locations[$location] = $menu;
    }
    set_theme_mod('nav_menu_locations',$locations);
    set_theme_mod('custom_logo',(int)$source['branding']['logo']);
    set_theme_mod('ge_footer_location',$source['branding']['location']);
    update_option('site_icon',(int)$source['branding']['icon']);
    update_option('show_on_front','page');
    update_option('page_on_front',$id);
    update_option('ge_p001_initialized',$id);
    flush_rewrite_rules();
}
WP_CLI::line(wp_json_encode(['page_id'=>$id,'url'=>get_permalink($id),'initialized'=>(bool)get_option('ge_p001_initialized')]));
