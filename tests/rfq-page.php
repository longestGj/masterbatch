<?php
if (!defined('SITE_STARTER_LOCAL') || SITE_STARTER_LOCAL !== true ||
    !in_array(wp_parse_url(home_url(), PHP_URL_HOST), ['localhost', '127.0.0.1'], true)) {
    WP_CLI::error('Local-only P006 page check refused.');
}
function ge_rfq_page_assert($ok,$message) { if (!$ok) throw new RuntimeException($message); }
$pages=get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>2,
    'meta_key'=>'_ge_page_id','meta_value'=>'P006']);
ge_rfq_page_assert(count($pages)===1, 'Exactly one owned P006 Page is required.');
$page=$pages[0];
ge_rfq_page_assert(get_post_meta($page->ID,'_ge_source_owner',true)==='ge-masterbatch', 'Page owner differs.');
ge_rfq_page_assert($page->post_name==='rfq', 'P006 must own /rfq.');
ge_rfq_page_assert(str_contains($page->post_content,'[ge_inquiry_form]'), 'Saved Page lacks the inquiry form.');
ge_rfq_page_assert(str_contains($page->post_content,'Tell GE about your masterbatch requirement'), 'Approved H1 is missing.');
ge_rfq_page_assert(str_contains($page->post_content,'A starting point for your discussion with GE'), 'Compact trust answer is missing.');
ge_rfq_page_assert(substr_count($page->post_content,'<!-- wp:heading {"level":1')===1, 'P006 should have one body H1.');
$rendered=apply_filters('the_content',$page->post_content);
ge_rfq_page_assert(str_contains($rendered,'name="company"'), 'Rendered form is missing Company.');
WP_CLI::success('P006 owned Page, copy and form rendering passed.');
