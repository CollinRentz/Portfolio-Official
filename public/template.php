<?php
// CRComments template

global $post;
$crcomments_settings_love = sanitize_text_field(get_option("crcomments_option_love"));
$crcomments_settings_reactions = sanitize_text_field(get_option("crcomments_option_reactions"));
if ($crcomments_settings_reactions == "" || $crcomments_settings_reactions == null) {
    $crcomments_settings_reactions = "no";
}
wp_enqueue_style(
    'crcomment_style',
    plugin_dir_url(__FILE__) . 'style.css?v=' . CRCOMMENTS_PLUGIN_VERSION
);

wp_enqueue_script(
    'crcomment_script',
    plugins_url('script.js?v=' . CRCOMMENTS_PLUGIN_VERSION, __FILE__),
    array('jquery'),
    '1.0',
    true
);

wp_localize_script('crcomment_script', 'crcomments_ajax', admin_url('admin-ajax.php'));
wp_localize_script('crcomment_script', 'crcomments_postID', [$post->ID]);

$crcomments_name = "";
$crcomments_email = "";
$crcomments_userID = 0;
if (is_user_logged_in()) {
    $current_user = wp_get_current_user();
    $crcomments_name = $current_user->display_name;
    $crcomments_email = $current_user->user_email;
    $crcomments_userID = $current_user->ID;
}
?>

<div id="crcomments">
  <h3 id = "respond">Leave a Reply</h3>
  <div id="crcomments_create_comment">
    <!-- comment form -->
    <label for="crcomments_comment_input" class="crcomments_label">Leave a Comment</label>
    <textarea
      id="crcomments_comment_input"
      rows="6"
      class="crcomments_input"
    ></textarea>

    <div id="crcomments_comment_contact" <?php if ($crcomments_name != "" && $crcomments_email != "") {echo 'style = "display:none;"';}?>>
      <div>
        <label for="crcomments_email_input" class="crcomments_label">Your Email</label>
        <input
          type="email"
          id="crcomments_email_input"
          class="crcomments_input"
		  value = "<?php echo $crcomments_email; ?>"
        />
      </div>
      <div>
        <label for="crcomments_name_input" class="crcomments_label">Your Name</label>
        <input
          type="text"
          id="crcomments_name_input"
          class="crcomments_input"
		  value = "<?php echo $crcomments_name; ?>"
        />
      </div>
    </div>
	<!-- <input type = "hidden" style = "" id = "crcomments_userID" value = "<?php echo $crcomments_userID; ?>"/> -->

    <div id="crcomments_comment_footer" class = "<?php if ($crcomments_settings_reactions != "no") {echo "crcomments_no_reactions";}?>">
		<?php
if ($crcomments_settings_reactions === "no") {
    ?>
      <div id="crcomments_comment_reactions">
        <h4 id="crcomments_reaction_title">Reactions</h4>
        <span class="crcomments_reaction" data-reaction="like">👍</span>
        <span class="crcomments_reaction" data-reaction="laugh">😆</span>
        <span class="crcomments_reaction" data-reaction="angry">😠</span>
        <span class="crcomments_reaction" data-reaction="sad">😢</span>
        <span class="crcomments_reaction" data-reaction="love">😍</span>
      </div>
		<?php
}
?>
      <button id="crcomments_submit" disabled="true">Submit</button>
		<?php
if ($crcomments_settings_love === "yes") {
    echo '<p style = "text-align:right; grid-column: 1 / -1;"><a href = "http://harmonicdesign.ca" title = "HDComments: Elegant WordPress Comments" style = "font-size:0.8em; text-decoration:none;">powered by HDComments</a></p>';
}
?>
    </div>
  </div>
  <div id = "crcomments_notice"></div>
  <div id="crcomments_comments">
    <h3>Comments</h3>
	<?php wp_list_comments('callback=crcomments_print_comments&style=ul');?>
  </div>
</div>



<?php

function crcomments_print_comments($comment, $args, $depth)
{
    global $post;
    $crcomments_settings_nested = intval(get_option("thread_comments"));
    $crcomments_settings_reactions = sanitize_text_field(get_option("crcomments_option_reactions"));
    if ($crcomments_settings_reactions == "" || $crcomments_settings_reactions == null) {
        $crcomments_settings_reactions = "no";
    }
    $crcomments_settings_votes = sanitize_text_field(get_option("crcomments_option_votes"));
    if ($crcomments_settings_votes == "" || $crcomments_settings_votes == null) {
        $crcomments_settings_votes = "no";
    }
    $crcomments_reaction = sanitize_text_field(get_comment_meta($comment->comment_ID, 'crcomments_reaction', true));
    if ($crcomments_reaction == null || $crcomments_reaction == "") {
        $crcomments_reaction = "none";
    }
    $crcomments_score = intval(get_comment_meta($comment->comment_ID, 'crcomments_score', true));
    if ($crcomments_score == null || $crcomments_score == "") {
        $crcomments_score = 0;
    }

    ?>

    <div class="crcomment <?php if ($comment->user_id === $post->post_author) {echo 'crcomment_post_author';}?>" id="crcomment_<?php echo $comment->comment_ID; ?>">
      <div class="crcomments_comment">
        <?php
$content = apply_filters('the_content', wp_kses_post($comment->comment_content));
    $content = str_replace(']]>', ']]&gt;', $content);
    echo $content;?>
      </div>
      <div class="crcomments_meta <?php if ($crcomments_settings_votes != "no") {echo "crcomments_no_votes";}?>">
		  <div>
			<?php if ($crcomments_settings_nested === 1) {?>
			<a href = "#respond" class = "crcomments_reply_link" data-id = "<?php echo $comment->comment_ID; ?>">reply</a>
			<?php }?>
			<div class="crcomments_meta_date_author">
			  <?php
$crcomments_publish_date = get_comment_date("", $comment->comment_ID);
    echo $crcomments_publish_date;
    //$crcomments_publish_time = get_comment_date("g:iA", $comment->comment_ID); // keep for time
    ?>
			  <span class="crcomments_meta_author crcomments_meta_author_<?php echo $comment->comment_ID; ?>">~<?php echo $comment->comment_author; ?></span>
	<?php
if ($crcomments_settings_reactions === "no") {
        if ($crcomments_reaction == "like") {
            echo '👍';
        } else if ($crcomments_reaction == "laugh") {
            echo '😆';
        } else if ($crcomments_reaction == "angry") {
            echo '😠';
        } else if ($crcomments_reaction == "sad") {
            echo '😢';
        } else if ($crcomments_reaction == "love") {
            echo '😍';
        }
    }
    ?>

			</div>
		  </div>
	<?php
if ($crcomments_settings_votes === "no") {
        ?>
        <div class="crcomments_vote">
          <span class="crcomments_vote_<?php echo $comment->comment_ID; ?>"><?php echo $crcomments_score; ?></span>
          <div class="crcomments_vote_options">
            <span class="crcomments_upvote"
              data-id="<?php echo $comment->comment_ID; ?>">▲</span>
            <span
              class="crcomments_downvote"
              data-id="<?php echo $comment->comment_ID; ?>"
              >▼</span>
          </div>
        </div>
		  <?php }?>
      </div>
    </div>

<?php
}
?>