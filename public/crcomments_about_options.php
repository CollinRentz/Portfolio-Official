jQuery("#crcomments_save_settings").click(function() {
  jQuery("#crcomments_save_settings").fadeOut(150);

  let crcomments_order = "";
  let crcomments_nested = "";
  let crcomments_love = "";
  let crcomments_attachments = "";
  let crcomments_reactions = "";
  let crcomments_votes = "";

  if (jQuery("#crcomments_settings_order").prop("checked") == true) {
    crcomments_order = "asc";
  } else {
    crcomments_order = "desc";
  }
  if (jQuery("#crcomments_settings_nested").prop("checked") == true) {
    crcomments_nested = 0;
  } else {
    crcomments_nested = 1;
  }
  if (jQuery("#crcomments_settings_attachments").prop("checked") == true) {
    crcomments_attachments = "yes";
  } else {
    crcomments_attachments = "no";
  }
  if (jQuery("#crcomments_settings_love").prop("checked") == true) {
    crcomments_love = "yes";
  } else {
    crcomments_love = "no";
  }
  if (jQuery("#crcomments_settings_reactions").prop("checked") == true) {
    crcomments_reactions = "yes";
  } else {
    crcomments_reactions = "no";
  }
  if (jQuery("#crcomments_settings_votes").prop("checked") == true) {
    crcomments_votes = "yes";
  } else {
    crcomments_votes = "no";
  }

  jQuery.ajax({
    type: "POST",
    data: {
      action: "crcomments_save_global_settings",
      crcomments_option_order: crcomments_order,
      crcomments_option_nested: crcomments_nested,
      crcomments_option_attachments: crcomments_attachments,
      crcomments_option_love: crcomments_love,
      crcomments_option_reactions: crcomments_reactions,
      crcomments_option_votes: crcomments_votes,
      crcomments_about_options_nonce: jQuery(
        "#crcomments_about_options_nonce"
      ).val()
    },
    url: ajaxurl,
    success: function(data) {
      console.log(data);
      if (data == "permission denied") {
        let data =
          "<p>Permission denied. Please refresh the page and try again</p>";
        jQuery("#crcomments_message").html(data);
        jQuery("#crcomments_message").fadeIn();
      } else {
        let data = "<p>crcomments settings have been saved</p>";
        jQuery("#crcomments_message").html(data);
        jQuery("#crcomments_message").fadeIn();
      }
    },
    error: function() {
      let data =
        "<p>Permission denied. Please refresh the page and try again</p>";
      jQuery("#crcomments_message").html(data);
      jQuery("#crcomments_message").fadeIn();
    },
    complete: function() {
      jQuery("#crcomments_save_settings").fadeIn(500);
    }
  });
});