<?php
defined('ABSPATH') || exit;

add_action('init', static function () {
    register_post_type('ge_inquiry', [
        'label'=>'Inquiries',
        'public'=>false,
        'publicly_queryable'=>false,
        'exclude_from_search'=>true,
        'show_ui'=>false,
        'show_in_rest'=>false,
        'show_in_nav_menus'=>false,
        'supports'=>[],
    ]);
});

function ge_rfq_validate(array $raw) {
    $intent = sanitize_key((string)($raw['intent'] ?? ''));
    if (!in_array($intent, ['model','sample','quote'], true)) {
        return new WP_Error('intent', 'Choose what you would like to discuss.');
    }
    $company = sanitize_text_field((string)($raw['company'] ?? ''));
    if ($company==='' || mb_strlen($company)>160) {
        return new WP_Error('company', 'Enter your company name.');
    }
    $email = sanitize_email((string)($raw['email'] ?? ''));
    if ($email==='' || !is_email($email) || strlen($email)>254) {
        return new WP_Error('email', 'Enter a valid email address.');
    }
    $message = sanitize_textarea_field((string)($raw['message'] ?? ''));
    if ($message==='' || mb_strlen($message)>4000) {
        return new WP_Error('message', 'Briefly describe your requirement.');
    }
    $product = sanitize_key((string)($raw['product'] ?? ''));
    if (!in_array($product, ['','black','white','color','desiccant','not-sure'], true)) {
        return new WP_Error('product', 'Choose a listed product interest or leave it blank.');
    }
    $name = sanitize_text_field((string)($raw['name'] ?? ''));
    $model = sanitize_text_field((string)($raw['model'] ?? ''));
    $details = sanitize_textarea_field((string)($raw['details'] ?? ''));
    if (mb_strlen($name)>120 || mb_strlen($model)>100 || mb_strlen($details)>4000) {
        return new WP_Error('length', 'Shorten the optional details and try again.');
    }
    return compact('intent','company','email','message','product','name','model','details');
}

function ge_rfq_save(array $raw) {
    $data = ge_rfq_validate($raw);
    if (is_wp_error($data)) return $data;
    $reference = wp_generate_uuid4();
    $meta = ['_ge_rfq_reference'=>$reference, '_ge_rfq_notification'=>'pending'];
    foreach ($data as $key=>$value) $meta['_ge_rfq_'.$key] = $value;
    $id = wp_insert_post([
        'post_type'=>'ge_inquiry',
        'post_status'=>'private',
        'post_title'=>'Inquiry '.$reference,
        'meta_input'=>$meta,
    ], true);
    if (is_wp_error($id)) return $id;
    foreach ($meta as $key=>$value) {
        if ((string)get_post_meta($id,$key,true)!==(string)$value) {
            wp_delete_post($id,true);
            return new WP_Error('storage', 'The inquiry could not be saved.');
        }
    }
    return (int)$id;
}
