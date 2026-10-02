<?php
/**
 * Plugin Name: Starter Local Safety
 * Description: Keeps local search hidden and blocks mail unless local SMTP is explicitly configured.
 */
defined('ABSPATH') || exit;
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true) return;
function ge_local_mail_ready(): bool {
    return getenv('GE_LOCAL_SMTP_ENABLED') === '1'
        && trim((string)getenv('GE_LOCAL_SMTP_HOST')) !== ''
        && in_array((int)getenv('GE_LOCAL_SMTP_PORT'), [465, 587, 994], true)
        && in_array((string)getenv('GE_LOCAL_SMTP_SECURE'), ['ssl', 'tls'], true)
        && trim((string)getenv('GE_LOCAL_SMTP_USER')) !== ''
        && trim((string)getenv('GE_LOCAL_SMTP_PASSWORD')) !== ''
        && is_email((string)getenv('GE_LOCAL_SMTP_FROM'));
}
if (ge_local_mail_ready()) {
    add_action('phpmailer_init', static function ($mailer): void {
        $mailer->isSMTP();
        $mailer->Host = (string)getenv('GE_LOCAL_SMTP_HOST');
        $mailer->Port = (int)getenv('GE_LOCAL_SMTP_PORT');
        $mailer->SMTPSecure = (string)getenv('GE_LOCAL_SMTP_SECURE');
        $mailer->SMTPAuth = true;
        $mailer->Username = (string)getenv('GE_LOCAL_SMTP_USER');
        $mailer->Password = (string)getenv('GE_LOCAL_SMTP_PASSWORD');
        $mailer->setFrom((string)getenv('GE_LOCAL_SMTP_FROM'));
    });
} else {
    add_filter('pre_wp_mail', '__return_false', PHP_INT_MAX);
}
add_filter('pre_option_blog_public', '__return_zero', PHP_INT_MAX);
add_filter('wp_robots', function () { return ['noindex'=>true,'nofollow'=>true]; }, PHP_INT_MAX);
add_filter('wp_sitemaps_enabled', '__return_false', PHP_INT_MAX);
add_action('send_headers', function () { header('X-Robots-Tag: noindex, nofollow', true); });
add_action('admin_notices', function () {
    if (current_user_can('manage_options')) {
        $mail = ge_local_mail_ready() ? 'uses configured SMTP' : 'is blocked';
        echo '<div class="notice notice-warning"><p>Local environment: WordPress mail '.esc_html($mail).' and search indexing is disabled. This does not provide access control.</p></div>';
    }
});
