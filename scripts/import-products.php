<?php
/** Explicit local P002 import. No menus, media edits or other page changes. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true || home_url('/') !== 'http://127.0.0.1:18086/') WP_CLI::error('Wrong P002 target.');
require_once __DIR__.'/inc/local-page-seed.php';
$s=json_decode(file_get_contents('/workspace/local/p002-page.json'),true,512,JSON_THROW_ON_ERROR);
if (($s['stable_id']??'')!=='P002'||($s['slug']??'')!=='products'||($s['route']??'')!=='/products/'||($s['home']??'')!==home_url('/')||
    ($s['template']??'')!=='page-templates/sectioned-page.php'||!is_file(get_theme_file_path('/page-templates/sectioned-page.php'))) WP_CLI::error('Invalid P002 payload.');
foreach(['title','description'] as $field) if(empty($s['seo'][$field])||!is_string($s['seo'][$field])) WP_CLI::error('Missing P002 SEO.');
$photo=(int)($s['photo_id']??0);
if (get_post_type($photo)!=='attachment'||get_post_meta($photo,'_ge_source_owner',true)!=='ge-masterbatch'||
    !str_starts_with(get_post_meta($photo,'_ge_asset_identity',true),'granules:')||!is_file(get_attached_file($photo))) WP_CLI::error('Unverified owned granules media.');
$pages=get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,'meta_key'=>'_ge_page_id','meta_value'=>'P002']);
if(count($pages)>1)WP_CLI::error('Duplicate P002 identity.');
if($pages){$id=$pages[0]->ID;
 $current=hash('sha256',wp_json_encode([get_post_meta($id,'_ge_seo_title',true),get_post_meta($id,'_ge_seo_description',true)]));
 $managed=get_post_meta($id,'_ge_managed_seo_state',true);
 if(!$managed||!hash_equals($managed,$current))WP_CLI::error('Preserve edited P002 SEO; reconcile first.');
 $managed=get_post_meta($id,'_ge_managed_template_state',true);
 if(!$managed||!hash_equals($managed,hash('sha256',get_post_meta($id,'_wp_page_template',true))))WP_CLI::error('Preserve edited P002 template.');
}
// Cooperating imports serialize on the same DB connection; fail rather than wait on another writer.
global $wpdb;
if((string)$wpdb->get_var("SELECT GET_LOCK('ge-local-page-writer',0)")!=='1')WP_CLI::error('Another local DB writer holds the import lock.');
try {
 $id=ge_seed_local_page($s);if(is_wp_error($id))WP_CLI::error($id->get_error_message());
 update_post_meta($id,'_ge_seo_title',$s['seo']['title']);update_post_meta($id,'_ge_seo_description',$s['seo']['description']);
 update_post_meta($id,'_ge_managed_seo_state',hash('sha256',wp_json_encode([$s['seo']['title'],$s['seo']['description']])));
 update_post_meta($id,'_wp_page_template',$s['template']);update_post_meta($id,'_ge_managed_template_state',hash('sha256',$s['template']));
 update_post_meta($id,'_ge_source_hash',$s['source_hash']);
 WP_CLI::line(wp_json_encode(['page_id'=>$id,'url'=>get_permalink($id),'template'=>$s['template'],'photo'=>$photo]));
}finally{$wpdb->get_var("SELECT RELEASE_LOCK('ge-local-page-writer')");}
