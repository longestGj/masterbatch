<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only RFQ fixture refused.');
}
function ge_rfq_assert($condition, $message) {
    if (!$condition) throw new RuntimeException($message);
}
ge_rfq_assert(function_exists('ge_rfq_validate'), 'RFQ validation function is missing.');
ge_rfq_assert(function_exists('ge_rfq_save'), 'RFQ save function is missing.');
$valid = [
    'intent'=>'model', 'company'=>'Example buyer', 'email'=>'buyer@example.test',
    'message'=>'We need to discuss black masterbatch for a new project.',
    'product'=>'not-sure', 'model'=>'', 'name'=>'', 'details'=>''
];
$data = ge_rfq_validate($valid);
ge_rfq_assert(is_array($data) && $data['model']==='', 'Unknown model must remain valid.');
$missing = $valid;
$missing['company'] = '';
ge_rfq_assert(is_wp_error(ge_rfq_validate($missing)), 'Company must be required.');
$invalid = $valid;
$invalid['email'] = 'not-an-email';
ge_rfq_assert(is_wp_error(ge_rfq_validate($invalid)), 'Invalid email must be rejected.');
$id = 0;
try {
    $id = ge_rfq_save($data);
    ge_rfq_assert(is_int($id) && $id>0, 'Valid inquiry did not save.');
    ge_rfq_assert(get_post_type($id)==='ge_inquiry', 'Wrong stored record type.');
    ge_rfq_assert(get_post_status($id)==='private', 'Inquiry must be private.');
    ge_rfq_assert(get_post_meta($id,'_ge_rfq_email',true)==='buyer@example.test', 'Reply email was not saved.');
    ge_rfq_assert(get_post_type_object('ge_inquiry')->show_in_rest===false, 'Inquiry must not expose Core REST route.');
    WP_CLI::success('RFQ required fields, unknown model, private save and REST boundary passed.');
} finally {
    if ($id>0) wp_delete_post($id,true);
}
