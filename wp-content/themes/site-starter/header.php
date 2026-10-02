<?php defined('ABSPATH') || exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main-content"><?php esc_html_e('Skip to content','site-starter'); ?></a>
<header class="site-header"><div class="ge-container ge-header-inner">
  <div class="ge-brand"><?php if (has_custom_logo()) { the_custom_logo(); } else { ?>
  <a class="site-name" href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>
  <?php } ?></div>
  <?php if (has_nav_menu('primary')) : ?>
  <nav class="ge-desktop-nav" aria-label="<?php esc_attr_e('Primary navigation','site-starter'); ?>">
    <?php wp_nav_menu(['theme_location'=>'primary','container'=>false,'fallback_cb'=>false,'depth'=>1]); ?>
  </nav>
  <?php endif; ?>
  <?php if (has_nav_menu('inquiry')) : ?><div class="ge-header-inquiry"><?php wp_nav_menu(['theme_location'=>'inquiry','container'=>false,'fallback_cb'=>false,'depth'=>1,'menu_class'=>'ge-inquiry-menu']); ?></div><?php endif; ?>
  <?php if (has_nav_menu('primary')) : ?>
  <details class="ge-mobile-menu"><summary><?php esc_html_e('Menu','site-starter'); ?><span aria-hidden="true" class="ge-menu-icon"></span></summary>
    <nav aria-label="<?php esc_attr_e('Mobile navigation','site-starter'); ?>">
      <?php wp_nav_menu(['theme_location'=>'primary','container'=>false,'fallback_cb'=>false,'depth'=>1]); ?>
      <?php if (has_nav_menu('inquiry')) wp_nav_menu(['theme_location'=>'inquiry','container'=>false,'fallback_cb'=>false,'depth'=>1,'menu_class'=>'ge-inquiry-menu']); ?>
    </nav>
  </details>
  <?php endif; ?>
</div></header>
