<?php
defined('ABSPATH') || exit;

function ge_rfq_receive(array $raw) {
    $nonce = (string)($raw['nonce'] ?? '');
    if (!$nonce || !wp_verify_nonce($nonce,'ge_rfq_submit')) {
        return new WP_Error('request','Refresh the page and try again.');
    }
    if (trim((string)($raw['website'] ?? ''))!=='') {
        return new WP_Error('request','The inquiry could not be submitted.');
    }
    $token = strtolower((string)($raw['submission_token'] ?? ''));
    if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/',$token)) {
        return new WP_Error('request','Refresh the page and try again.');
    }
    $data = ge_rfq_validate($raw);
    if (is_wp_error($data)) return $data;
    $fingerprint = hash('sha256',wp_json_encode($data));
    $token_key = 'ge_rfq_once_'.hash('sha256',$token);
    $previous = get_transient($token_key);
    if (is_array($previous) && isset($previous['id'],$previous['fingerprint']) &&
        get_post_type((int)$previous['id'])==='ge_inquiry') {
        if (!hash_equals((string)$previous['fingerprint'],$fingerprint)) {
            return new WP_Error('duplicate','This submission was already used. Refresh the page to start another.');
        }
        return ['id'=>(int)$previous['id'],'saved'=>true];
    }
    $address = (string)($_SERVER['REMOTE_ADDR'] ?? '');
    if ($address!=='') {
        $rate_key = 'ge_rfq_rate_'.hash_hmac('sha256',$address,wp_salt('auth'));
        $count = (int)get_transient($rate_key);
        if ($count>=5) return new WP_Error('rate','Please wait before sending another inquiry.');
    }
    $id = ge_rfq_save($data);
    if (is_wp_error($id)) return $id;
    set_transient($token_key,['id'=>$id,'fingerprint'=>$fingerprint],10*MINUTE_IN_SECONDS);
    if ($address!=='') set_transient($rate_key,$count+1,HOUR_IN_SECONDS);
    try {
        ge_rfq_notify($id);
    } catch (Throwable $error) {
        update_post_meta($id,'_ge_rfq_notification','failed');
    }
    return ['id'=>$id,'saved'=>true];
}
