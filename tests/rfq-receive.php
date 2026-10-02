<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only RFQ receive fixture refused.');
}
function ge_rfq_receive_assert($ok,$message) { if (!$ok) throw new RuntimeException($message); }
ge_rfq_receive_assert(function_exists('ge_rfq_receive'), 'RFQ receive function is missing.');
$ids=[];
$request=[
    'intent'=>'model','company'=>'Example buyer','email'=>'buyer@example.test',
    'message'=>'We want to discuss a project without a model.','product'=>'not-sure',
    'nonce'=>wp_create_nonce('ge_rfq_submit'), 'submission_token'=>wp_generate_uuid4(),
    'website'=>''
];
try {
    $first=ge_rfq_receive($request);
    ge_rfq_receive_assert(is_array($first) && !empty($first['id']), 'Valid inquiry must save.');
    $ids[]=$first['id'];
    ge_rfq_receive_assert($first['saved']===true, 'Buyer success must follow saved record.');
    ge_rfq_receive_assert($first['id']===ge_rfq_receive($request)['id'], 'Repeated token must not create a second inquiry.');
    ge_rfq_receive_assert(get_post_meta($first['id'],'_ge_rfq_notification',true)==='blocked_local',
        'Local email state must be internal and must not invalidate save success.');
    $bad=$request;
    $bad['nonce']='invalid';
    $bad['submission_token']=wp_generate_uuid4();
    ge_rfq_receive_assert(is_wp_error(ge_rfq_receive($bad)), 'Invalid request nonce must fail.');
    $trap=$request;
    $trap['website']='spam';
    $trap['submission_token']=wp_generate_uuid4();
    ge_rfq_receive_assert(is_wp_error(ge_rfq_receive($trap)), 'Spam trap must refuse submission.');
    WP_CLI::success('RFQ save-driven success, duplicate, request protection and local mail separation passed.');
} finally {
    foreach ($ids as $id) if (get_post($id)) wp_delete_post($id,true);
}
