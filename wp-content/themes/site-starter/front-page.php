<?php
defined('ABSPATH') || exit;
if (!is_page()) { require __DIR__.'/index.php'; return; }
get_header();
?>
<main id="main-content" class="ge-home" tabindex="-1">
<?php while (have_posts()) : the_post();
    $approved_copy = get_post_meta(get_the_ID(),'_ge_source_owner',true)==='ge-masterbatch' && get_post_meta(get_the_ID(),'_ge_page_id',true)==='P001';
    $restore_texturize = $approved_copy && has_filter('the_content','wptexturize')!==false;
    if ($restore_texturize) remove_filter('the_content','wptexturize');
    the_content();
    if ($restore_texturize) add_filter('the_content','wptexturize');
    wp_link_pages();
endwhile; ?>
</main>
<?php get_footer(); ?>
