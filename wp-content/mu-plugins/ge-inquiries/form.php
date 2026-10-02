<?php
defined('ABSPATH') || exit;

add_shortcode('ge_inquiry_form', static function () {
    wp_enqueue_script('ge-inquiry-form',content_url('mu-plugins/ge-inquiries/form.js'),[],
        (string)filemtime(__DIR__.'/form.js'),true);
    $nonce = wp_create_nonce('ge_rfq_submit');
    $token = wp_generate_uuid4();
    ob_start();
    ?>
    <div class="ge-rfq-widget">
      <form class="ge-rfq-form" action="<?php echo esc_url(admin_url('admin-ajax.php')); ?>" method="post" hidden>
        <input type="hidden" name="action" value="ge_rfq_submit">
        <input type="hidden" name="nonce" value="<?php echo esc_attr($nonce); ?>">
        <input type="hidden" name="submission_token" value="<?php echo esc_attr($token); ?>">
        <div class="ge-rfq-field ge-rfq-trap" aria-hidden="true"><label>Leave this field blank <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <fieldset class="ge-rfq-field"><legend>What would you like to discuss? <span>Required</span></legend>
          <p>Choose one: Discuss a model; Ask about a sample or trial; Request a quotation.</p>
          <label><input type="radio" name="intent" value="model" required> Discuss a model</label>
          <label><input type="radio" name="intent" value="sample" required> Ask about a sample or trial</label>
          <label><input type="radio" name="intent" value="quote" required> Request a quotation</label>
        </fieldset>
        <div class="ge-rfq-field"><label for="ge-rfq-company">Company name <span>Required</span></label>
          <p>Enter the company making the inquiry.</p><input id="ge-rfq-company" name="company" type="text" maxlength="160" required></div>
        <div class="ge-rfq-field"><label for="ge-rfq-email">Email address <span>Required</span></label>
          <p>Use an address where GE can reply.</p><input id="ge-rfq-email" name="email" type="email" maxlength="254" required></div>
        <div class="ge-rfq-field"><label for="ge-rfq-message">Tell us about your requirement <span>Required</span></label>
          <p>Briefly describe your project or question. You can write even if you do not know the model yet.</p>
          <textarea id="ge-rfq-message" name="message" maxlength="4000" required></textarea></div>
        <div class="ge-rfq-optional">
          <div class="ge-rfq-field"><label for="ge-rfq-name">Your name <span>Optional</span></label>
            <p>Helps GE address its reply.</p><input id="ge-rfq-name" name="name" type="text" maxlength="120"></div>
          <div class="ge-rfq-field"><label for="ge-rfq-product">Product interest <span>Optional</span></label>
            <p>Choose a product interest if useful.</p><select id="ge-rfq-product" name="product">
              <option value="">Select if useful</option><option value="black">Black masterbatch</option>
              <option value="white">White masterbatch</option><option value="color">Color masterbatch</option>
              <option value="desiccant">Desiccant masterbatch</option><option value="not-sure">Not sure yet</option>
            </select></div>
          <div class="ge-rfq-field"><label for="ge-rfq-model">GE model, if known <span>Optional</span></label>
            <p>Enter a model only if you already know it.</p><input id="ge-rfq-model" name="model" type="text" maxlength="100"></div>
          <div class="ge-rfq-field"><label for="ge-rfq-details">Other useful details <span>Optional</span></label>
            <p>Add any known resin, processing method, intended use, quantity, destination or trial context. These details can help focus the next question and are optional at this stage.</p>
            <textarea id="ge-rfq-details" name="details" maxlength="4000"></textarea></div>
        </div>
        <div class="ge-rfq-privacy">
          <p><strong>How we use and keep your inquiry</strong></p>
          <p>GE Chemical &amp; Polymer Group Co., Ltd. uses the information you submit to review and respond to your inquiry. We save it in WordPress for site administrators and may send a copy by email to Jenny. The WordPress record has no automatic deletion date; an administrator keeps it until manually deleted.</p>
          <p>To ask to see or delete your inquiry, email <a href="mailto:jenny@ge-masterbatch.com">jenny@ge-masterbatch.com</a>. We will verify the request and manually handle the WordPress record and email copy.</p>
        </div>
        <button type="submit" class="ge-rfq-submit">Send inquiry</button>
      </form>
      <p class="ge-rfq-result" role="status" aria-live="polite" hidden></p>
      <noscript><p>To contact GE without this form, <a href="mailto:jenny@ge-masterbatch.com">email Jenny</a>.</p></noscript>
    </div>
    <?php
    return ob_get_clean();
});

function ge_rfq_ajax_submit(): void {
    $raw = wp_unslash($_POST);
    $result = ge_rfq_receive(is_array($raw)?$raw:[]);
    if (is_wp_error($result)) {
        wp_send_json_error(['message'=>$result->get_error_message(),'field'=>$result->get_error_code()],422);
    }
    wp_send_json_success(['saved'=>true]);
}
add_action('wp_ajax_nopriv_ge_rfq_submit','ge_rfq_ajax_submit');
add_action('wp_ajax_ge_rfq_submit','ge_rfq_ajax_submit');
