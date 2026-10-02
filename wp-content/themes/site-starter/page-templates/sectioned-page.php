<?php
/**
 * Template Name: Sectioned Page
 * Description: Full-width rendering for pages whose headings and sections live in Core blocks.
 */
defined('ABSPATH') || exit;
get_header();
?>
<main id="main-content" class="ge-sectioned-main" tabindex="-1">
<?php while (have_posts()) : the_post();
    $owned = get_post_meta(get_the_ID(), '_ge_source_owner', true) === 'ge-masterbatch';
    $restore_texturize = $owned && has_filter('the_content', 'wptexturize') !== false;
    if ($restore_texturize) remove_filter('the_content', 'wptexturize');
    the_content();
    if ($restore_texturize) add_filter('the_content', 'wptexturize');
    wp_link_pages();
endwhile; ?>
</main>
<?php get_footer(); ?>
