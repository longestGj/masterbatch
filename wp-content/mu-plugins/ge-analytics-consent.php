<?php
/**
 * Plugin Name: GE Analytics Choice
 * Description: Loads optional GA4 only after a visitor allows analytics.
 */
defined('ABSPATH') || exit;

const GE_GA4_MEASUREMENT_ID = 'G-60H18F67V4';

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_script('ge-analytics-choice', content_url('mu-plugins/ge-analytics-choice.js'), [],
        (string)filemtime(__DIR__.'/ge-analytics-choice.js'), true);
});

add_action('wp_footer', static function (): void {
    $privacy = get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>1,
        'meta_key'=>'_ge_page_id','meta_value'=>'P011']);
    $privacy_url = $privacy ? get_permalink($privacy[0]->ID) : '';
    ?>
    <div class="ge-analytics-choice" data-measurement-id="<?php echo esc_attr(GE_GA4_MEASUREMENT_ID); ?>"
      data-preview-only="<?php echo defined('SITE_STARTER_LOCAL') && SITE_STARTER_LOCAL === true && getenv('GE_GA4_PREVIEW_ONLY') !== '0' ? '1' : '0'; ?>">
      <button type="button" class="ge-analytics-settings" hidden>Privacy settings</button>
      <div class="ge-analytics-panel" role="region" aria-label="Analytics choice">
        <p><strong>Optional website analytics</strong></p>
        <p>GE uses Google Analytics to understand visits to this website. Analytics is off until you allow it. You can change this choice later using Privacy settings.</p>
        <?php if ($privacy_url) : ?><p><a href="<?php echo esc_url($privacy_url); ?>">Read our privacy information</a></p><?php endif; ?>
        <div class="ge-analytics-actions">
          <button type="button" data-choice="declined">Decline analytics</button>
          <button type="button" data-choice="accepted">Allow analytics</button>
        </div>
      </div>
    </div>
    <?php
}, 5);
