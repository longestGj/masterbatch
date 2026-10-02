<?php
/** Read back the four public records and optionally remove the exact deployment fixture. */
if (!defined('WP_CLI') || !WP_CLI) return;
$mode = $args[0] ?? 'verify';
if (!in_array($mode,['verify','cleanup'],true) || home_url('/')!=='https://152.70.109.64/') WP_CLI::error('Target or mode mismatch.');
if ($mode==='verify') {
    foreach (['P005'=>'/documents/','P017'=>'/products/bk020/','P011'=>'/privacy/','P006'=>'/rfq/'] as $stable=>$route) {
        $matches=get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>2,
            'meta_key'=>'_ge_page_id','meta_value'=>$stable]);
        if (count($matches)!==1 || get_post_meta($matches[0]->ID,'_ge_source_owner',true)!=='ge-masterbatch' ||
            get_permalink($matches[0])!==home_url($route)) WP_CLI::error($stable.' saved identity or route mismatch.');
        $source=json_decode(file_get_contents('/workspace/import/'.strtolower($stable).'-public.json'),true,512,JSON_THROW_ON_ERROR);
        if ($matches[0]->post_content!==$source['content'] || $matches[0]->post_title!==$source['title']) WP_CLI::error($stable.' saved copy mismatch.');
        if (isset($source['seo']) && (get_post_meta($matches[0]->ID,'_ge_seo_title',true)!==$source['seo']['title'] ||
            get_post_meta($matches[0]->ID,'_ge_seo_description',true)!==$source['seo']['description'])) WP_CLI::error($stable.' SEO mismatch.');
        if ($stable==='P017' && (int)$matches[0]->post_parent!==45) WP_CLI::error('P017 parent mismatch.');
        if ($stable==='P011' && (int)get_option('wp_page_for_privacy_policy')!==$matches[0]->ID) WP_CLI::error('Privacy setting mismatch.');
        WP_CLI::line($stable.' saved record '. $matches[0]->ID.' verified.');
    }
}
$fixtures=get_posts(['post_type'=>'ge_inquiry','post_status'=>'private','numberposts'=>3,
    'meta_key'=>'_ge_rfq_company','meta_value'=>'GE Deployment Check 20261003']);
if (count($fixtures)!==1 || get_post_meta($fixtures[0]->ID,'_ge_rfq_email',true)!=='buyer@example.test' ||
    get_post_meta($fixtures[0]->ID,'_ge_rfq_message',true)!=='Synthetic deployment verification. No customer request.') WP_CLI::error('Scoped inquiry fixture missing or changed.');
$id=$fixtures[0]->ID;
if ($mode==='cleanup') { wp_delete_post($id,true); WP_CLI::success('Removed exact deployment inquiry fixture.'); return; }
WP_CLI::line('Inquiry fixture '.$id.' notification '.get_post_meta($id,'_ge_rfq_notification',true).' reference '.get_post_meta($id,'_ge_rfq_reference',true));
