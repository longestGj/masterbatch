<?php defined('ABSPATH') || exit; get_header(); ?>
<main id="main-content" class="ge-rfq-page" tabindex="-1">
<?php while (have_posts()) : the_post(); ?>
  <article <?php post_class(); ?>><?php the_content(); ?></article>
<?php endwhile; ?>
</main>
<?php get_footer(); ?>
