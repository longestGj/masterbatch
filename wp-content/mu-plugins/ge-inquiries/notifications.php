<?php
defined('ABSPATH') || exit;

function ge_rfq_notify(int $id): bool {
    if (get_post_type($id)!=='ge_inquiry' ||
        get_post_meta($id,'_ge_rfq_notification',true)!=='pending') return false;
    $reference = get_post_meta($id,'_ge_rfq_reference',true);
    $fields = [
        'Reference'=>$reference,
        'Purpose'=>get_post_meta($id,'_ge_rfq_intent',true),
        'Company'=>get_post_meta($id,'_ge_rfq_company',true),
        'Reply email'=>get_post_meta($id,'_ge_rfq_email',true),
        'Name'=>get_post_meta($id,'_ge_rfq_name',true),
        'Product interest'=>get_post_meta($id,'_ge_rfq_product',true),
        'GE model'=>get_post_meta($id,'_ge_rfq_model',true),
        'Requirement'=>get_post_meta($id,'_ge_rfq_message',true),
        'Other details'=>get_post_meta($id,'_ge_rfq_details',true),
    ];
    $lines = [];
    foreach ($fields as $label=>$value) $lines[] = $label.': '.(string)$value;
    $attempt = wp_mail(
        'jenny@ge-masterbatch.com',
        'GE website inquiry '.$reference,
        implode("\n\n",$lines),
        ['Content-Type: text/plain; charset=UTF-8']
    );
    $status = $attempt ? 'dispatched' : (
        defined('SITE_STARTER_LOCAL') && SITE_STARTER_LOCAL===true ? 'blocked_local' : 'failed'
    );
    update_post_meta($id,'_ge_rfq_notification',$status);
    update_post_meta($id,'_ge_rfq_notification_at',current_time('mysql',true));
    return (bool)$attempt;
}
