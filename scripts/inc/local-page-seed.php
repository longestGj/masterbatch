<?php
/** Local Core Page seeding with explicit ownership and preservation of editor changes. */
function ge_check_local_menu_initialization(array $locations) {
    $assigned = get_theme_mod('nav_menu_locations',[]);
    foreach ($locations as $location) {
        if (!empty($assigned[$location]) || wp_get_nav_menu_object('GE '.$location)) {
            return new WP_Error('foreign_menu','Existing navigation assignment or menu name requires explicit reconciliation.');
        }
    }
    return true;
}
function ge_seed_local_page(array $source) {
    if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
        !in_array(wp_parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true)) return new WP_Error('non_local','Local-only page import refused.');
    foreach (['stable_id','slug','title','content'] as $field) {
        if (!isset($source[$field]) || !is_string($source[$field]) || $source[$field]==='') return new WP_Error('invalid_payload','Missing page source: '.$field);
    }
    $matches = get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,
        'meta_key'=>'_ge_page_id','meta_value'=>$source['stable_id']]);
    if (count($matches)>1) return new WP_Error('duplicate_identity','Duplicate stable page identity.');
    $existing = $matches[0] ?? null;
    $slugMatch = get_page_by_path($source['slug'],OBJECT,'page');
    if (($existing && get_post_meta($existing->ID,'_ge_source_owner',true)!=='ge-masterbatch') ||
        ($slugMatch && (!$existing || $slugMatch->ID!==$existing->ID))) return new WP_Error('foreign_page','Page collision or foreign ownership; no adoption.');
    if ($existing) {
        $managed = get_post_meta($existing->ID,'_ge_managed_state',true);
        $current = hash('sha256',wp_json_encode([$existing->post_title,$existing->post_name,$existing->post_status,$existing->post_content]));
        if (!is_string($managed) || !hash_equals($managed,$current)) return new WP_Error('editor_changes','Saved editor changes differ from the last imported state; preserve and review.');
    }
    $record = ['post_type'=>'page','post_status'=>$source['status'] ?? 'draft','post_name'=>$source['slug'],
        'post_title'=>$source['title'],'post_content'=>$source['content']];
    if ($existing) $record['ID'] = $existing->ID;
    $id = wp_insert_post(wp_slash($record),true);
    if (is_wp_error($id)) return $id;
    update_post_meta($id,'_ge_page_id',$source['stable_id']);
    update_post_meta($id,'_ge_source_owner','ge-masterbatch');
    $saved = get_post($id);
    update_post_meta($id,'_ge_managed_state',hash('sha256',wp_json_encode([$saved->post_title,$saved->post_name,$saved->post_status,$saved->post_content])));
    return $id;
}
