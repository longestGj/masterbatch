<?php
/** P017 presentation only; facts live in its editable Core Page. */
defined('ABSPATH') || exit;
add_action('after_setup_theme', function () { add_editor_style('assets/bk020.css'); });
add_action('wp_enqueue_scripts', function () {
    if (is_page() && get_post_meta(get_queried_object_id(), '_ge_page_id', true) === 'P017') {
        wp_enqueue_style('site-starter-bk020', get_theme_file_uri('/assets/bk020.css'), ['site-starter'], (string)filemtime(get_theme_file_path('/assets/bk020.css')));
    }
});
add_filter('render_block_core/image', function ($content, $block) {
    if (!str_contains($block['attrs']['className'] ?? '', 'ge-p017-photo')) return $content;
    $tags = new WP_HTML_Tag_Processor($content);
    if ($tags->next_tag('IMG')) {
        $tags->set_attribute('loading', 'eager');
        $tags->set_attribute('fetchpriority', 'high');
        $tags->set_attribute('sizes', '(max-width: 600px) calc(100vw - 48px), (max-width: 760px) calc(100vw - 72px), (max-width: 1000px) calc((100vw - 120px) / 2), 552px');
    }
    return $tags->get_updated_html();
}, 10, 2);
