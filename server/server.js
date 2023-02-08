const express = require('express')
const cors = require('cors')
const app = express ()

app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const {
    // getComment,
    // deleteComment, 
    // createComment, 
    // updateVotes,
    getHTML
} = require('./controller')

app.get('/', getHTML)

// app.get(`/api/comment`, getComment)
// app.delete(`/api/comment/:id`, deleteComment)
// app.post(`/api/comment`, createComment)
// app.put(`/api/comment/:id`, updateVotes)

const port = process.env.PORT || 4005 

app. listen(port, console.log(`Server running on ${port}`))