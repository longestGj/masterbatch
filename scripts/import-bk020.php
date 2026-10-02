<?php
/** Scoped local P017 import. Preserve foreign ownership and editor changes. */
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true || home_url('/') !== 'http://127.0.0.1:18086/') WP_CLI::error('Wrong P017 local target.');
require_once __DIR__.'/inc/local-page-seed.php';
$s = json_decode(file_get_contents('/workspace/local/p017-page.json'), true, 512, JSON_THROW_ON_ERROR);
if (($s['stable_id'] ?? '') !== 'P017' || ($s['slug'] ?? '') !== 'bk020' || ($s['route'] ?? '') !== '/products/bk020/' ||
    ($s['parent_stable_id'] ?? '') !== 'P002' || ($s['home'] ?? '') !== home_url('/') || ($s['status'] ?? '') !== 'publish' ||
    ($s['template'] ?? '') !== 'page-templates/sectioned-page.php' || !has_blocks($s['content'] ?? '') ||
    !is_file(get_theme_file_path('/assets/bk020.css'))) WP_CLI::error('Invalid approved P017 payload or theme.');
foreach (['title','description'] as $field) if (!is_string($s['seo'][$field] ?? null) || $s['seo'][$field] === '') WP_CLI::error('P017 SEO missing.');
if (preg_match('/22%|47\.8%|99\.8%|10%|mailto:/', $s['content'])) WP_CLI::error('Private formulation or superseded action in P017.');
global $wpdb;
if ((string)$wpdb->get_var("SELECT GET_LOCK('ge-local-page-writer',0)") !== '1') WP_CLI::error('Another local writer holds the lock.');
try {
    $parents = get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>2,'meta_key'=>'_ge_page_id','meta_value'=>'P002']);
    if (count($parents) !== 1 || get_post_meta($parents[0]->ID,'_ge_source_owner',true) !== 'ge-masterbatch' || get_permalink($parents[0]) !== home_url('/products/')) WP_CLI::error('Owned P002 parent identity or route mismatch.');
    $parent = $parents[0]->ID;
    $photo = (int)($s['photo_id'] ?? 0);
    if (get_post_type($photo) !== 'attachment' || get_post_meta($photo,'_ge_source_owner',true) !== 'ge-masterbatch' ||
        !str_starts_with(get_post_meta($photo,'_ge_asset_identity',true),'granules:') || !is_file(get_attached_file($photo))) WP_CLI::error('Unverified owned granules media.');
    $matches = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,'meta_key'=>'_ge_page_id','meta_value'=>'P017']);
    if (count($matches) > 1) WP_CLI::error('Duplicate P017 identity.');
    $route = get_page_by_path('products/bk020',OBJECT,'page');
    if ($route && (!$matches || $route->ID !== $matches[0]->ID || get_post_meta($route->ID,'_ge_source_owner',true) !== 'ge-masterbatch')) WP_CLI::error('Foreign P017 route collision.');
    if ($matches) {
        $id = $matches[0]->ID;
        if ((int)get_post($id)->post_parent !== $parent || get_post_meta($id,'_ge_managed_parent',true) !== (string)$parent) WP_CLI::error('Edited P017 parent requires reconciliation.');
        $seo = hash('sha256',wp_json_encode([get_post_meta($id,'_ge_seo_title',true),get_post_meta($id,'_ge_seo_description',true)]));
        $managed = get_post_meta($id,'_ge_managed_seo_state',true);
        if (!$managed || !hash_equals($managed,$seo)) WP_CLI::error('Preserve edited P017 SEO.');
        $managed = get_post_meta($id,'_ge_managed_template_state',true);
        if (!$managed || !hash_equals($managed,hash('sha256',get_post_meta($id,'_wp_page_template',true)))) WP_CLI::error('Preserve edited P017 template.');
    }
    $id = ge_seed_local_page($s);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    $result = wp_update_post(['ID'=>$id,'post_parent'=>$parent],true);
    if (is_wp_error($result)) WP_CLI::error($result->get_error_message());
    update_post_meta($id,'_ge_managed_parent',(string)$parent);
    update_post_meta($id,'_ge_seo_title',$s['seo']['title']);
    update_post_meta($id,'_ge_seo_description',$s['seo']['description']);
    update_post_meta($id,'_ge_managed_seo_state',hash('sha256',wp_json_encode([$s['seo']['title'],$s['seo']['description']])));
    update_post_meta($id,'_wp_page_template',$s['template']);
    update_post_meta($id,'_ge_managed_template_state',hash('sha256',$s['template']));
    update_post_meta($id,'_ge_source_hash',$s['source_hash']);
    if (get_permalink($id) !== home_url('/products/bk020/')) WP_CLI::error('Saved P017 permalink mismatch; inspect ID '.$id);
    WP_CLI::line(wp_json_encode(['page_id'=>$id,'url'=>get_permalink($id),'parent'=>$parent,'template'=>$s['template'],'photo'=>$photo]));
} finally { $wpdb->get_var("SELECT RELEASE_LOCK('ge-local-page-writer')"); }
