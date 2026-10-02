<?php
/** Scoped P002 rendering; product facts remain editable Core Page content. */
defined('ABSPATH') || exit;
add_action('after_setup_theme',function(){add_editor_style('assets/products.css');});
add_action('wp_enqueue_scripts',function(){
 if(is_page()&&get_post_meta(get_queried_object_id(),'_ge_page_id',true)==='P002')
  wp_enqueue_style('site-starter-products',get_theme_file_uri('/assets/products.css'),['site-starter'],(string)filemtime(get_theme_file_path('/assets/products.css')));
});
add_filter('render_block_core/image',function($content,$block){
 if(!str_contains($block['attrs']['className']??'','ge-p002-hero-photo'))return $content;
 $tags=new WP_HTML_Tag_Processor($content);
 if($tags->next_tag('IMG')){
  $tags->set_attribute('loading','eager');$tags->set_attribute('fetchpriority','high');
  $tags->set_attribute('sizes','(max-width: 600px) calc(100vw - 48px), (max-width: 860px) calc(100vw - 72px), 408px');
 }
 return $tags->get_updated_html();
},10,2);
add_filter('render_block_core/table',function($content,$block){
 if(!str_contains($block['attrs']['className']??'','ge-p002-family-table'))return $content;
 // Derive phone labels from the saved editable table, not a parallel specification.
 // Core table head cells are HTML-sourced attributes: PHP parse_blocks has no attrs.head.
 preg_match_all('/<th\b[^>]*>(.*?)<\/th>/is',$content,$headings);
 $labels=array_map(fn($text)=>html_entity_decode(wp_strip_all_tags($text),ENT_QUOTES,'UTF-8'),$headings[1]);
 $tags=new WP_HTML_Tag_Processor($content);$column=0;
 while($tags->next_tag()){
  if($tags->get_tag()==='TR')$column=0;
  if($tags->get_tag()==='TD'){$tags->set_attribute('data-label',$labels[$column]??'');$column++;}
 }
 return $tags->get_updated_html();
},10,2);
