<?php
defined('ABSPATH') || exit;
add_action('init',function () {
    foreach (['page','post'] as $type) {
        foreach (['_ge_seo_title','_ge_seo_description'] as $key) {
            register_post_meta($type,$key,['type'=>'string','single'=>true,'show_in_rest'=>true,
                'revisions_enabled'=>true,'sanitize_callback'=>'sanitize_text_field',
                'auth_callback'=>function () { return current_user_can('edit_posts'); }]);
        }
    }
});
add_filter('pre_get_document_title',function ($title) {
    if (is_singular()) {
        $saved = get_post_meta(get_queried_object_id(),'_ge_seo_title',true);
        if ($saved!=='') return $saved;
    }
    return $title;
});
function ge_page_seo_head() {
    if (is_singular()) {
        $description = get_post_meta(get_queried_object_id(),'_ge_seo_description',true);
        if ($description!=='') echo '<meta name="description" content="'.esc_attr($description).'">'."\n";
    }
    if (!is_front_page()) return;
    $base = home_url('/');
    $organization = ['@type'=>'Organization','@id'=>$base.'#organization','name'=>get_bloginfo('name'),'url'=>$base];
    $logo = wp_get_attachment_image_url(get_theme_mod('custom_logo'),'full');
    if ($logo) $organization['logo'] = $logo;
    $graph = [$organization,['@type'=>'WebSite','@id'=>$base.'#website','url'=>$base,'name'=>get_bloginfo('name'),'publisher'=>['@id'=>$base.'#organization']]];
    if (is_page()) $graph[] = ['@type'=>'WebPage','@id'=>$base.'#webpage','url'=>$base,'name'=>wp_get_document_title(),
        'isPartOf'=>['@id'=>$base.'#website'],'about'=>['@id'=>$base.'#organization']];
    echo '<script type="application/ld+json">'.wp_json_encode(['@context'=>'https://schema.org','@graph'=>$graph],JSON_UNESCAPED_SLASHES|JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).'</script>'."\n";
}
add_action('wp_head','ge_page_seo_head',5);
add_action('add_meta_boxes',function () {
    foreach (['page','post'] as $type) add_meta_box('ge-page-seo','Search presentation',function ($post) {
        wp_nonce_field('ge_save_page_seo','ge_page_seo_nonce');
        echo '<p><label for="ge-seo-title">SEO title</label><br><input id="ge-seo-title" class="widefat" name="ge_seo_title" value="'.esc_attr(get_post_meta($post->ID,'_ge_seo_title',true)).'"></p>';
        echo '<p><label for="ge-seo-description">Meta description</label><br><textarea id="ge-seo-description" class="widefat" name="ge_seo_description" rows="3">'.esc_textarea(get_post_meta($post->ID,'_ge_seo_description',true)).'</textarea></p>';
    },$type,'normal');
});
add_action('save_post',function ($id) {
    if (wp_is_post_revision($id) || wp_is_post_autosave($id) || !current_user_can('edit_post',$id)) return;
    if (!isset($_POST['ge_page_seo_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ge_page_seo_nonce'])),'ge_save_page_seo')) return;
    foreach (['ge_seo_title'=>'_ge_seo_title','ge_seo_description'=>'_ge_seo_description'] as $field=>$key) {
        if (isset($_POST[$field])) update_post_meta($id,$key,sanitize_text_field(wp_unslash($_POST[$field])));
    }
});
