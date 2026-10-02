<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) WP_CLI::error('Local-only SEO fixture refused.');
function ge_seo_check($condition,$message) { if (!$condition) throw new RuntimeException($message); }
$id = 0;
$user = get_user_by('login',getenv('WP_ADMIN_USER'));
ge_seo_check($user && user_can($user,'edit_pages'),'Local administrator unavailable.');
wp_set_current_user($user->ID);
try {
    $id = wp_insert_post(['post_type'=>'page','post_status'=>'draft','post_title'=>'SEO revision fixture '.wp_generate_uuid4(),
        'post_content'=>'<!-- wp:paragraph --><p>Original SEO fixture.</p><!-- /wp:paragraph -->'],true);
    ge_seo_check(is_int($id) && $id>0,'Fixture creation failed.');
    $legacy = wp_save_post_revision($id);
    if (!$legacy) $legacy = array_key_first(wp_get_post_revisions($id));
    $request = new WP_REST_Request('POST','/wp/v2/pages/'.$id);
    $request->set_body_params(['content'=>'<!-- wp:paragraph --><p>SEO version A.</p><!-- /wp:paragraph -->',
        'meta'=>['_ge_seo_title'=>'SEO title A','_ge_seo_description'=>'SEO description A']]);
    $response = rest_do_request($request);
    ge_seo_check($response->get_status()===200,'SEO REST save failed.');
    $revision = wp_save_post_revision($id);
    if (!$revision) $revision = array_key_first(wp_get_post_revisions($id));
    $request->set_body_params(['content'=>'<!-- wp:paragraph --><p>SEO version B.</p><!-- /wp:paragraph -->',
        'meta'=>['_ge_seo_title'=>'SEO title B','_ge_seo_description'=>'SEO description B']]);
    ge_seo_check(rest_do_request($request)->get_status()===200,'SEO update failed.');
    ge_seo_check((bool)wp_restore_post_revision($revision),'SEO revision restore failed.');
    ge_seo_check(get_post_meta($id,'_ge_seo_title',true)==='SEO title A' &&
        get_post_meta($id,'_ge_seo_description',true)==='SEO description A','SEO revision did not restore paired metadata.');
    ge_seo_check((bool)wp_restore_post_revision($legacy),'Legacy revision restore failed.');
    ge_seo_check(get_post_meta($id,'_ge_seo_title',true)==='' && get_post_meta($id,'_ge_seo_description',true)==='',
        'Legacy revision did not restore absent SEO values.');
    WP_CLI::success('Native REST SEO save, paired meta revision restore and legacy empty values passed.');
} finally {
    if (is_int($id) && $id>0) wp_delete_post($id,true);
}
