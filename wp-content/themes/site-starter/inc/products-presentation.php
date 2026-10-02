<?php
/** Scoped P002 rendering; product facts remain editable Core Page content. */
defined('ABSPATH') || exit;
add_action('after_setup_theme',function(){add_editor_style('assets/products.css');});
add_action('wp_enqueue_scripts',function(){
 if(is_page()&&get_post_meta(get_queried_object_id(),'_ge_page_id',true)==='P002')
  wp_enqueue_style('site-starter-products',get_theme_file_uri('/assets/products.css'),['site-starter'],(string)filemtime(get_theme_file_path('/assets/products.css')));
});
add_filter('render_block_core/image',function($content,$block){
 if(!str_contains($block['attrs']['className']??'','ge-p002-black-photo'))return $content;
 $tags=new WP_HTML_Tag_Processor($content);
 if($tags->next_tag('IMG')){
  $tags->set_attribute('sizes','(max-width: 600px) calc(100vw - 48px), (max-width: 760px) calc(100vw - 72px), 440px');
 }
 return $tags->get_updated_html();
},10,2);
