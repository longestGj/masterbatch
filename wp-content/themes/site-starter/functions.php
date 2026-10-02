<?php
defined('ABSPATH') || exit;
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form','gallery','caption','style','script']);
    add_theme_support('editor-styles');
    add_theme_support('custom-logo', ['height'=>160, 'width'=>560, 'flex-height'=>true, 'flex-width'=>true]);
    add_theme_support('align-wide');
    add_editor_style(['assets/site.css','assets/about.css','assets/editor.css']);
    register_nav_menus(['primary'=>'Primary navigation','footer'=>'Footer navigation',
        'inquiry'=>'Inquiry action','footer-products'=>'Footer products',
        'footer-company'=>'Footer company','footer-information'=>'Footer information']);
});
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('site-starter', get_theme_file_uri('/assets/site.css'), [], (string)filemtime(get_theme_file_path('/assets/site.css')));
    if (is_page_template('page-templates/sectioned-page.php')) {
        wp_enqueue_style('site-starter-about', get_theme_file_uri('/assets/about.css'), ['site-starter'], (string)filemtime(get_theme_file_path('/assets/about.css')));
    }
});
add_action('init',function () {
    foreach (['ge-primary'=>'GE · Primary inquiry','ge-secondary'=>'GE · Secondary product entry','ge-text'=>'GE · Text link'] as $name=>$label) {
        register_block_style('core/button',['name'=>$name,'label'=>$label]);
    }
});
require __DIR__.'/inc/page-seo.php';
add_action('customize_register',function ($customizer) {
    $customizer->add_setting('ge_footer_location',['default'=>'','sanitize_callback'=>'sanitize_text_field','transport'=>'refresh']);
    $customizer->add_control('ge_footer_location',['label'=>'Footer company location','section'=>'title_tagline','type'=>'text']);
});
add_filter('render_block_core/image',function ($content,$block) {
    $class = $block['attrs']['className'] ?? '';
    if (str_contains($class,'ge-hero-factory') || str_contains($class,'ge-hero-product')) {
        $tags = new WP_HTML_Tag_Processor($content);
        if ($tags->next_tag('IMG')) {
            $tags->set_attribute('loading','eager');
            $tags->set_attribute('sizes',str_contains($class,'ge-hero-factory')?'(max-width: 600px) calc(100vw - 48px), (max-width: 760px) calc(100vw - 72px), (max-width: 1000px) 40vw, 486px':'(max-width: 600px) 45vw, 282px');
            if (str_contains($class,'ge-hero-factory')) $tags->set_attribute('fetchpriority','high');
        }
        return $tags->get_updated_html();
    }
    return $content;
},10,2);
