<?php
defined('ABSPATH') || exit;

function ge_rfq_admin_allowed(): bool {
    $user = wp_get_current_user();
    return $user->exists() && in_array('administrator',$user->roles,true) && current_user_can('manage_options');
}

add_action('admin_menu', static function () {
    add_menu_page('GE inquiries','GE inquiries','manage_options','ge-inquiries','ge_rfq_admin_page','dashicons-email-alt2',27);
});

function ge_rfq_admin_page(): void {
    if (!ge_rfq_admin_allowed()) wp_die('Access denied.');
    $id = absint($_GET['inquiry'] ?? 0);
    echo '<div class="wrap"><h1>GE inquiries</h1>';
    if ($id) {
        $post = get_post($id);
        if (!$post || $post->post_type!=='ge_inquiry') wp_die('Inquiry not found.');
        echo '<p><a href="'.esc_url(admin_url('admin.php?page=ge-inquiries')).'">← All inquiries</a></p>';
        echo '<p><strong>Reference:</strong> '.esc_html(get_post_meta($id,'_ge_rfq_reference',true)).'</p>';
        echo '<p><strong>Saved:</strong> '.esc_html($post->post_date).'</p>';
        echo '<p><strong>Notification:</strong> '.esc_html(get_post_meta($id,'_ge_rfq_notification',true)).'</p>';
        foreach (['intent','company','email','name','product','model','message','details'] as $key) {
            $value = get_post_meta($id,'_ge_rfq_'.$key,true);
            echo '<p><strong>'.esc_html(ucfirst($key)).':</strong><br>'.nl2br(esc_html((string)$value)).'</p>';
        }
        echo '<form method="post" action="'.esc_url(admin_url('admin-post.php')).'">';
        echo '<input type="hidden" name="action" value="ge_rfq_delete">';
        echo '<input type="hidden" name="inquiry" value="'.esc_attr((string)$id).'">';
        wp_nonce_field('ge_rfq_delete_'.$id);
        echo '<button type="submit" class="button" onclick="return confirm(\'Delete this inquiry permanently?\')">Delete inquiry</button></form>';
    } else {
        $page = max(1,absint($_GET['paged'] ?? 1));
        $query = new WP_Query(['post_type'=>'ge_inquiry','post_status'=>'private','posts_per_page'=>30,
            'paged'=>$page,'orderby'=>'date','order'=>'DESC']);
        echo '<table class="widefat striped"><thead><tr><th>Saved</th><th>Company</th><th>Purpose</th><th>Notification</th><th>Reference</th></tr></thead><tbody>';
        foreach ($query->posts as $post) {
            $url = add_query_arg(['page'=>'ge-inquiries','inquiry'=>$post->ID],admin_url('admin.php'));
            echo '<tr><td>'.esc_html($post->post_date).'</td><td><a href="'.esc_url($url).'">'.esc_html(get_post_meta($post->ID,'_ge_rfq_company',true)).'</a></td>';
            echo '<td>'.esc_html(get_post_meta($post->ID,'_ge_rfq_intent',true)).'</td>';
            echo '<td>'.esc_html(get_post_meta($post->ID,'_ge_rfq_notification',true)).'</td>';
            echo '<td>'.esc_html(get_post_meta($post->ID,'_ge_rfq_reference',true)).'</td></tr>';
        }
        echo '</tbody></table>';
        if ($page>1) echo '<a class="button" href="'.esc_url(add_query_arg(['page'=>'ge-inquiries','paged'=>$page-1],admin_url('admin.php'))).'">Previous</a> ';
        if ($page<$query->max_num_pages) echo '<a class="button" href="'.esc_url(add_query_arg(['page'=>'ge-inquiries','paged'=>$page+1],admin_url('admin.php'))).'">Next</a>';
    }
    echo '</div>';
}

add_action('admin_post_ge_rfq_delete', static function () {
    if (!ge_rfq_admin_allowed()) wp_die('Access denied.');
    $id = absint($_POST['inquiry'] ?? 0);
    check_admin_referer('ge_rfq_delete_'.$id);
    if (!$id || get_post_type($id)!=='ge_inquiry') wp_die('Inquiry not found.');
    wp_delete_post($id,true);
    wp_safe_redirect(admin_url('admin.php?page=ge-inquiries'));
    exit;
});
