<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only RFQ form fixture refused.');
}
function ge_rfq_form_assert($ok,$message) { if (!$ok) throw new RuntimeException($message); }
ge_rfq_form_assert(shortcode_exists('ge_inquiry_form'), 'RFQ form shortcode is missing.');
$html = do_shortcode('[ge_inquiry_form]');
foreach (['name="company"','name="email"','name="intent"','name="message"','name="submission_token"','name="nonce"'] as $item) {
    ge_rfq_form_assert(str_contains($html,$item), 'RFQ form is missing '.$item);
}
ge_rfq_form_assert(str_contains($html,'Not sure yet'), 'Unknown product path is missing.');
ge_rfq_form_assert(str_contains($html,'no automatic deletion date'), 'Retention notice is missing.');
ge_rfq_form_assert(str_contains($html,'mailto:jenny@ge-masterbatch.com'), 'Privacy request route is missing.');
ge_rfq_form_assert(strpos($html,'ge-rfq-privacy') < strpos($html,'Send inquiry'),
    'Privacy notice must be visible before form submission.');
ge_rfq_form_assert(!str_contains($html,'Your inquiry has been received'), 'Unverified sales receipt claim is prohibited.');
WP_CLI::success('RFQ form fields and buyer-facing claim boundary passed.');
