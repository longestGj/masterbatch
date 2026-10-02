<?php
/** Scoped publication of P005, P017, P006 and P011 on the identified HTTPS IP site. */
if (!defined('WP_CLI') || !WP_CLI) return;
$mode = $args[0] ?? '';
if (!in_array($mode, ['preflight','publish'], true)) WP_CLI::error('Expected preflight or publish.');
if (home_url('/') !== 'https://152.70.109.64/' || site_url('/') !== 'https://152.70.109.64/') WP_CLI::error('Public IP site identity mismatch.');
$specs = [
    'P005'=>['slug'=>'documents','route'=>'/documents/','template'=>'page-templates/sectioned-page.php'],
    'P017'=>['slug'=>'bk020','route'=>'/products/bk020/','template'=>'page-templates/sectioned-page.php'],
    'P006'=>['slug'=>'rfq','route'=>'/rfq/','template'=>'default'],
    'P011'=>['slug'=>'privacy','route'=>'/privacy/','template'=>'default'],
];
$sources = [];
foreach ($specs as $stable => $spec) {
    $file = '/workspace/import/'.strtolower($stable).'-public.json';
    if (!is_file($file)) WP_CLI::error($stable.' payload missing.');
    $s = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
    if (($s['stable_id'] ?? '') !== $stable || ($s['slug'] ?? '') !== $spec['slug'] ||
        ($s['route'] ?? '') !== $spec['route'] || ($s['home'] ?? '') !== home_url('/') ||
        ($s['status'] ?? '') !== 'publish' || !is_string($s['title'] ?? null) || $s['title'] === '' ||
        !is_string($s['content'] ?? null) || !has_blocks($s['content']) ||
        str_contains($s['content'],'127.0.0.1') || str_contains($s['content'],':18086') || str_contains($s['content'],':18087')) WP_CLI::error($stable.' source mismatch.');
    if ($spec['template'] !== 'default' && (($s['template'] ?? '') !== $spec['template'] ||
        !is_file(get_theme_file_path('/'.$spec['template'])))) WP_CLI::error($stable.' template mismatch.');
    if ($stable === 'P005' && !is_file(get_theme_file_path('/assets/documents.css'))) WP_CLI::error('P005 style missing.');
    if ($stable === 'P017' && (!is_file(get_theme_file_path('/assets/bk020.css')) ||
        ($s['parent_stable_id'] ?? '') !== 'P002' || ($s['photo_id'] ?? null) !== 13 ||
        preg_match('/22%|47\.8%|99\.8%|10%|mailto:/', $s['content']))) WP_CLI::error('P017 source restrictions failed.');
    if ($stable === 'P006' && (!is_file(get_theme_file_path('/page-rfq.php')) ||
        !function_exists('ge_rfq_receive') || !str_contains($s['content'],'[ge_inquiry_form]'))) WP_CLI::error('P006 form dependency missing.');
    if ($stable === 'P011' && (!is_string($s['seo']['title'] ?? null) || !is_string($s['seo']['description'] ?? null))) WP_CLI::error('P011 SEO missing.');
    if (in_array($stable,['P005','P017'],true) && (!is_string($s['seo']['title'] ?? null) ||
        !is_string($s['seo']['description'] ?? null))) WP_CLI::error($stable.' SEO missing.');
    $matches = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,
        'meta_key'=>'_ge_page_id','meta_value'=>$stable]);
    if ($matches || get_page_by_path(trim($spec['route'],'/'),OBJECT,'page')) WP_CLI::error($stable.' identity or route collision; preserve existing content.');
    $sources[$stable] = $s;
}
$parents = get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>2,'meta_key'=>'_ge_page_id','meta_value'=>'P002']);
if (count($parents)!==1 || get_post_meta($parents[0]->ID,'_ge_source_owner',true)!=='ge-masterbatch' ||
    get_permalink($parents[0])!==home_url('/products/')) WP_CLI::error('Owned P002 parent mismatch.');
$media = get_post(13);
if (!$media || $media->post_type!=='attachment' ||
    get_post_meta(13,'_ge_source_owner',true)!=='ge-masterbatch' ||
    get_post_meta(13,'_ge_asset_identity',true)!=='granules:2911cff540042acc27f0cdc793d10b4d4e45d389b8b6100357ee06d3b97ad858' ||
    !is_file(get_attached_file(13))) WP_CLI::error('P017 media identity mismatch.');
if ((int)get_option('wp_page_for_privacy_policy')!==3 || get_post_status(3)!=='draft') WP_CLI::error('Existing WordPress privacy draft changed.');
if ($mode==='preflight') { WP_CLI::success('Four page sources, dependencies, parent, media and collisions passed.'); return; }
$ids=[];
foreach (['P005','P017','P011','P006'] as $stable) {
    $s=$sources[$stable]; $spec=$specs[$stable];
    $data=['post_type'=>'page','post_status'=>'publish','post_name'=>$spec['slug'],
        'post_title'=>$s['title'],'post_content'=>$s['content']];
    if ($stable==='P017') $data['post_parent']=$parents[0]->ID;
    $id=wp_insert_post(wp_slash($data),true);
    if (is_wp_error($id)) WP_CLI::error($stable.' insert failed: '.$id->get_error_message());
    $saved=get_post($id);
    if ($saved->post_name!==$spec['slug'] || get_permalink($id)!==home_url($spec['route'])) WP_CLI::error($stable.' saved route mismatch; inspect ID '.$id);
    update_post_meta($id,'_ge_page_id',$stable);
    update_post_meta($id,'_ge_source_owner','ge-masterbatch');
    update_post_meta($id,'_ge_source_hash',$s['source_hash'] ?? hash('sha256',$s['content']));
    update_post_meta($id,'_ge_managed_state',hash('sha256',wp_json_encode([
        $saved->post_title,$saved->post_name,$saved->post_status,$saved->post_content])));
    if (isset($s['seo'])) {
        update_post_meta($id,'_ge_seo_title',$s['seo']['title']);
        update_post_meta($id,'_ge_seo_description',$s['seo']['description']);
        update_post_meta($id,'_ge_managed_seo_state',hash('sha256',wp_json_encode([
            $s['seo']['title'],$s['seo']['description']])));
    }
    if ($spec['template']!=='default') {
        update_post_meta($id,'_wp_page_template',$spec['template']);
        update_post_meta($id,'_ge_managed_template_state',hash('sha256',$spec['template']));
    }
    if ($stable==='P017') update_post_meta($id,'_ge_managed_parent',(string)$parents[0]->ID);
    $ids[$stable]=$id;
}
update_option('wp_page_for_privacy_policy',$ids['P011']);
WP_CLI::success('Published '.wp_json_encode($ids).' with privacy Page selected.');
