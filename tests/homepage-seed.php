<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only homepage fixture refused.');
}
$library = '/workspace/scripts/inc/local-page-seed.php';
if (!is_file($library)) WP_CLI::error('Homepage seed API is not implemented.');
require_once $library;
function ge_seed_check($condition, $message) { if (!$condition) throw new RuntimeException($message); }
$ids = [];
$suffix = wp_generate_uuid4();
$originalLocations = get_theme_mod('nav_menu_locations',[]);
$menu = 0;
$source = ['stable_id'=>'P001-fixture-'.$suffix, 'slug'=>'ge-fixture-'.$suffix,
    'title'=>'Homepage import fixture', 'status'=>'draft',
    'content'=>'<!-- wp:paragraph --><p>Original approved copy.</p><!-- /wp:paragraph -->'];
try {
    ge_seed_check(function_exists('ge_check_local_menu_initialization'), 'Menu assignment preservation guard is missing.');
    $menu = wp_create_nav_menu('Existing navigation fixture '.$suffix);
    ge_seed_check(!is_wp_error($menu), 'Menu fixture creation failed.');
    set_theme_mod('nav_menu_locations',array_merge($originalLocations,['primary'=>$menu]));
    $menuConflict = ge_check_local_menu_initialization(['primary']);
    ge_seed_check(is_wp_error($menuConflict), 'Assigned menu with another name must refuse initialization.');
    ge_seed_check(get_theme_mod('nav_menu_locations')['primary']===$menu, 'Existing navigation assignment changed.');
    set_theme_mod('nav_menu_locations',$originalLocations);
    $foreign = wp_insert_post(['post_type'=>'page','post_status'=>'draft','post_name'=>$source['slug'],'post_title'=>'Foreign page'], true);
    ge_seed_check(!is_wp_error($foreign), 'Fixture creation failed.');
    $ids[] = $foreign;
    $collision = ge_seed_local_page($source);
    ge_seed_check(is_wp_error($collision) && $collision->get_error_code()==='foreign_page', 'An unowned matching slug must not be adopted.');
    ge_seed_check(get_post_field('post_title',$foreign)==='Foreign page', 'Foreign page was changed.');
    wp_delete_post($foreign,true);
    $created = ge_seed_local_page($source);
    ge_seed_check(!is_wp_error($created), 'Owned creation failed.');
    $ids[] = $created;
    $repeat = ge_seed_local_page($source);
    ge_seed_check($repeat===$created, 'Identical repeat must retain the same Page.');
    $changed = $source;
    $changed['content'] = '<!-- wp:paragraph --><p>Updated approved copy.</p><!-- /wp:paragraph -->';
    ge_seed_check(ge_seed_local_page($changed)===$created, 'Approved update should retain stable identity.');
    $revision = wp_save_post_revision($created);
    if (!$revision) $revision = array_key_first(wp_get_post_revisions($created));
    wp_update_post(['ID'=>$created,'post_content'=>'<!-- wp:paragraph --><p>Editor-owned change.</p><!-- /wp:paragraph -->']);
    $conflict = ge_seed_local_page($changed);
    ge_seed_check(is_wp_error($conflict) && $conflict->get_error_code()==='editor_changes', 'Repeat import must refuse editor changes.');
    ge_seed_check(str_contains(get_post_field('post_content',$created),'Editor-owned change'), 'Editor content was overwritten.');
    ge_seed_check((bool)wp_restore_post_revision($revision), 'Revision restore failed.');
    ge_seed_check(str_contains(get_post_field('post_content',$created),'Updated approved copy'), 'Restored content differs.');
    update_post_meta($created,'_ge_source_owner','another-owner');
    $foreignOwner = ge_seed_local_page($changed);
    ge_seed_check(is_wp_error($foreignOwner) && $foreignOwner->get_error_code()==='foreign_page', 'Stable ID without matching ownership must be refused.');
    WP_CLI::success('Homepage creation/repeat, foreign collision refusal, editor preservation and revision restore passed.');
} finally {
    set_theme_mod('nav_menu_locations',$originalLocations);
    if (is_int($menu) && $menu>0) wp_delete_nav_menu($menu);
    foreach (array_unique($ids) as $id) if (get_post($id)) wp_delete_post($id,true);
}
