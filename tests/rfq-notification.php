<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only RFQ notification fixture refused.');
}
function ge_rfq_notice_assert($ok,$message) { if (!$ok) throw new RuntimeException($message); }
ge_rfq_notice_assert(function_exists('ge_rfq_notify'), 'RFQ notification function is missing.');
$id = 0;
try {
    $id = ge_rfq_save([
        'intent'=>'quote','company'=>'Example buyer','email'=>'buyer@example.test',
        'message'=>'Please discuss a quotation with us.','product'=>'black'
    ]);
    ge_rfq_notice_assert(is_int($id), 'Fixture inquiry could not save.');
    $result = ge_rfq_notify($id);
    ge_rfq_notice_assert($result===false, 'Local outbound mail must remain blocked.');
    ge_rfq_notice_assert(get_post_meta($id,'_ge_rfq_notification',true)==='blocked_local',
        'Local blocked-mail state must be visible to administrators.');
    ge_rfq_notice_assert(get_post_meta($id,'_ge_rfq_email',true)==='buyer@example.test',
        'Failed notification must preserve the saved inquiry.');
    WP_CLI::success('RFQ local mail block and saved-record preservation passed.');
} finally {
    if (is_int($id) && $id>0) wp_delete_post($id,true);
}
