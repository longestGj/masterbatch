<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only RFQ admin fixture refused.');
}
function ge_rfq_admin_assert($ok,$message) { if (!$ok) throw new RuntimeException($message); }
ge_rfq_admin_assert(function_exists('ge_rfq_admin_allowed'), 'RFQ admin access check is missing.');
$admins = get_users(['role'=>'administrator','number'=>1]);
ge_rfq_admin_assert((bool)$admins, 'No local administrator exists.');
$previous = get_current_user_id();
$subscriber = 0;
try {
    wp_set_current_user($admins[0]->ID);
    ge_rfq_admin_assert(ge_rfq_admin_allowed(), 'Administrator must view inquiries.');
    $subscriber = wp_create_user('rfq_fixture_'.wp_generate_password(8,false),'fixture-only', 'rfq-fixture@example.test');
    ge_rfq_admin_assert(is_int($subscriber), 'Subscriber fixture creation failed.');
    (new WP_User($subscriber))->set_role('subscriber');
    wp_set_current_user($subscriber);
    ge_rfq_admin_assert(!ge_rfq_admin_allowed(), 'Subscriber must not view inquiries.');
    wp_set_current_user(0);
    ge_rfq_admin_assert(!ge_rfq_admin_allowed(), 'Anonymous visitor must not view inquiries.');
    WP_CLI::success('RFQ admin-only access boundary passed.');
} finally {
    wp_set_current_user($previous);
    if ($subscriber) wp_delete_user($subscriber);
}
