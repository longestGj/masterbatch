<?php defined('ABSPATH') || exit; ?>
<footer class="site-footer"><div class="ge-container ge-footer-grid">
  <div class="ge-footer-identity">
    <div class="ge-brand"><?php if (has_custom_logo()) { the_custom_logo(); } else { ?><p><?php bloginfo('name'); ?></p><?php } ?></div>
    <?php if (get_theme_mod('ge_footer_location')) : ?><p><?php echo esc_html(get_theme_mod('ge_footer_location')); ?></p><?php endif; ?>
    <?php if (has_nav_menu('inquiry')) wp_nav_menu(['theme_location'=>'inquiry','container'=>false,'fallback_cb'=>false,'depth'=>1,'menu_class'=>'ge-inquiry-menu']); ?>
  </div>
  <?php foreach (['footer-products'=>'Products','footer-company'=>'Company','footer-information'=>'Information'] as $location=>$label) : ?>
    <?php if (has_nav_menu($location)) : ?><div class="ge-footer-column"><h2><?php echo esc_html($label); ?></h2>
      <nav aria-label="<?php echo esc_attr($label); ?>"><?php wp_nav_menu(['theme_location'=>$location,'container'=>false,'fallback_cb'=>false,'depth'=>1]); ?></nav>
    </div><?php endif; ?>
  <?php endforeach; ?>
  <?php if (has_nav_menu('footer')) : ?><nav class="ge-footer-extra" aria-label="<?php esc_attr_e('Footer navigation','site-starter'); ?>"><?php wp_nav_menu(['theme_location'=>'footer','container'=>false,'fallback_cb'=>false,'depth'=>1]); ?></nav><?php endif; ?>
</div></footer>
<?php wp_footer(); ?>
</body>
</html>
