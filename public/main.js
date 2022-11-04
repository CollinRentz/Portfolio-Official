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
