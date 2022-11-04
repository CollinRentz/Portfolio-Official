<<<<<<< HEAD
const changeVote = (id, type) => {
    axios.put(`${baseURL}/${id}`, {type}).then(commentCallback).catch(errCallback);
    console.log(id, type);
};

const commentContainer = document.querySelector('#comment-container')
const form = document.querySelector('form')

const baseURL = ("http://localhost:4005/api/comment")

const commentCallback = ({ data: comment }) => displayComment(comment)
const errCallback = err => console.log(err)

const getAllComment = () => axios.get(baseURL).then(commentCallback).catch(errCallback)
const createComment= body => axios.post(baseURL, body).then(commentCallback).catch(errCallback)
const deleteComment = id => axios.delete(`${baseURL}/${id}`).then(commentCallback).catch(errCallback)
const updateVotes = (id, type) => axios.put(`${baseURL}/${id}`, {type}).then(commentCallback).catch(errCallback);

function submitHandler(e) {
    e.preventDefault()

    let comment = document.querySelector('#crc_comment_input')
    let name = document.querySelector('.crc_input')
    console.log(name)

    let bodyObj = {
        name: name.value,
        comment: comment.value,
        votes: 0
    }

    createComment(bodyObj)
    name.value = ''
    comment.value = ''
}

function createCommentCard(comment) {
    const commentCard = document.createElement('div')
    commentCard.classList.add('comment-card')
console.log(comment.id);
    commentCard.innerHTML = `
    <div class = "crcomment" id = "${comment.id}">
        <div class = "crc_comment">
            <p>${comment.comment}</p>
        </div>
        <div class = "crcmeta">
            <div class = "crc_meta_date_author">
            ${comment.date}
                <span class = "crc_meta_author">~${comment.name}</span>
            </div>
            <div class = "crc_vote">
                <span class = "crc_vote_1">${comment.votes}</span>
                <div class="crc_vote_options">
                    <span class = "crc_upvote" onclick="changeVote(${comment.id}, 'plus')">&#9650</span>
                    <span class = "crc_downvote" onclick="changeVote(${comment.id}, 'minus')">&#9660</span>
                </div>
            </div>
        </div>
        <button id="crc_delete" onclick="deleteComment(${comment.id})">Delete</button>
    </div>`


    commentContainer.appendChild(commentCard)
}

function displayComment(arr) {
    commentContainer.innerHTML = ``
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        createCommentCard(arr[i])
    }
}

form.addEventListener('submit', submitHandler)

getAllComment()
=======
console.log("comments init");

const CRC_EL = {
    submit: document.getElementById("crcomments_submit"),
    comment: document.getElementById("crcomments_comment_input"),
    name: document.getElementById("crcomments_name_input"),
    reactions: document.getElementsByClassName("crcomments_reaction"),
    upvotes: document.getElementsByClassName("crcomments_upvote"),
    downvotes: document.getElementsByClassName("crcomments_downvote"),
    notice: document.getElementById("crcomments_notice"),
    commentCreate: document.getElementById("crcomments_create_comment"),
    reply: document.getElementsByClassName("crcomments_reply_link"),
    respond: document.getElementById("respond")
  };

//const crcomments_ID = parseInt(crcomments_postID[0]);

let canSubmit = false;
let isSubmitting = false;
let reaction = null;
let commentParent = 0;


function crcomments_submit() {
    if (canSubmit) {
      let comment = {
        postID: crcomments_ID,
        parentID: commentParent,
        comment: CRC_EL.comment.value.trim(),
        name: CRC_EL.name.value.trim(),
        reaction: reaction
      };
      crcomments_disable_submit();
      isSubmitting = true;
      crcomments_submit_comment(comment);
    }
  }
  
  function crcomments_submit_comment(comment) {
    let comments = JSON.stringify(comment);
    jQuery.ajax({
      type: "POST",
      data: {
        action: "crcomments_submit",
        comment: comments,
        crcomments_h: "crcomments"
      },
      url: crcomments_ajax,
      success: function(data) {
        crcomments_reset_form(data);
      }
    });
  }
  
  function crcomments_submit_vote(commentID, vote) {
    let updown = null;
    if (vote) {
      updown = "up";
    } else {
      updown = "down";
    }
    let data = {
      commentID: parseInt(commentID),
      updown: updown
    };
    data = JSON.stringify(data);
    jQuery.ajax({
      type: "POST",
      data: {
        action: "crcomments_submit_vote",
        data: data
      },
      url: crcomments_ajax,
      success: function(data) {
        console.log(data);
      }
    });
  }
  
  function crcomments_reset_form(data) {
    CRC_EL.commentCreate.remove();
    CRC_EL.notice.innerHTML = "<p>" + data + "</p>";
    CRC_EL.notice.style.display = "block";
  }
  
  function crcomments_can_submit() {
    if (!isSubmitting) {
      let comment = CRC_EL.comment.value.trim();
      let name = CRC_EL.name.value.trim();
      if (comment.length > 9 && name.length > 3) {
        
          CRC_EL.submit.classList.add("crcomments_submit_enabled");
          CRC_EL.submit.disabled = false;
          canSubmit = true;
      } else {
        crcomments_disable_submit();
      }
    }
  }
  
  function crcomments_disable_submit() {
    CRC_EL.submit.classList.remove("crcomments_submit_enabled");
    CRC_EL.submit.disabled = true;
    canSubmit = false;
  }
  
  function crcomments_select_reaction() {
    console.log(this)
    reaction = this.getAttribute("data-reaction");
    let prev = document.getElementsByClassName("crcomments_reaction_selected")[0];
    if (prev) {
      prev.classList.remove("crcomments_reaction_selected");
    }
    this.classList.add("crcomments_reaction_selected");
  }
  
  function crcomments_vote(el, vote) {
    let commentID = el.getAttribute("data-id");
    let score = document.getElementsByClassName("crcomments_vote_" + commentID)[0]
      .innerText;
    score = parseInt(score);
  
    // if first time vote
    if (!el.classList.contains("crcomments_vote_disabled")) {
      if (vote) {
        score = score + 1;
      } else {
        score = score - 1;
      }
  
      if (score > 0) {
        score = "+" + score;
      }
      document.getElementsByClassName(
        "crcomments_vote_" + commentID
      )[0].innerText = score;
  
      el.classList.add("crcomments_vote_selected");
      elVotes = document.querySelectorAll(
        "#crcomment_" + commentID + " .crcomments_vote_options span"
      );
      for (let i = 0; i < elVotes.length; i++) {
        elVotes[i].classList.add("crcomments_vote_disabled");
      }
      crcomments_submit_vote(commentID, vote);
    } else if (el.classList.contains("crcomments_vote_selected")) {
      // unvote
      if (vote) {
        score = score - 1;
      } else {
        score = score + 1;
      }
  
      if (score > 0) {
        score = "+" + score;
      }
      document.getElementsByClassName(
        "crcomments_vote_" + commentID
      )[0].innerText = score;
  
      el.classList.remove("crcomments_vote_selected");
      elVotes = document.querySelectorAll(
        "#crcomment_" + commentID + " .crcomments_vote_options span"
      );
      for (let i = 0; i < elVotes.length; i++) {
        elVotes[i].classList.remove("crcomments_vote_disabled");
      }
      crcomments_submit_vote(commentID, !vote);
    }
  }
  
  function crcomments_reply() {
    commentParent = this.getAttribute("data-id");
    let replyTo = document.getElementsByClassName(
      "crcomments_meta_author_" + commentParent
    )[0].innerText;
    CRC_EL.respond.innerHTML =
      "Replying to " +
      replyTo +
      '<span class = "crcomments_remove_reply" id = "crcomments_remove_reply" title = "cancel reply"></span>';
    document
      .getElementById("crcomments_remove_reply")
      .addEventListener("click", crcomments_remove_reply);
  }
  
  function crcomments_remove_reply() {
    CRC_EL.respond.innerHTML = "Leave a Reply";
    commentParent = 0;
  }
  
  function crcomments_set_event_listeners() {
    CRC_EL.submit.addEventListener("click", crcomments_submit);
    CRC_EL.comment.addEventListener("keyup", crcomments_can_submit);
    CRC_EL.name.addEventListener("keyup", crcomments_can_submit);
    for (let i = 0; i < CRC_EL.reactions.length; i++) {
      CRC_EL.reactions[i].addEventListener("click", crcomments_select_reaction);
    }
    for (let i = 0; i < CRC_EL.upvotes.length; i++) {
      CRC_EL.upvotes[i].addEventListener("click", function() {
        crcomments_vote(this, true);
      });
      CRC_EL.downvotes[i].addEventListener("click", function() {
        crcomments_vote(this, false);
      });
    }
    for (let i = 0; i < CRC_EL.reply.length; i++) {
      CRC_EL.reply[i].addEventListener("click", crcomments_reply);
    }
  }
  crcomments_set_event_listeners();
>>>>>>> origin/main
