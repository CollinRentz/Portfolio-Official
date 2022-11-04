const path = require('path')
const comments = require('./db.json')
let globalId = 4

module.exports = {
    getHTML: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    },
    getComment: (req, res) => res.status(200).send(comments),
    deleteComment: (req, res) => {
        let index = comments.findIndex(elem => elem.id === +req.params.id)
        comments.splice(index, 1)
        res.status(200).send(comments)
    },
    createComment: (req, res) => {
        console.log("hit")
        let { name, comment, votes } = req.body
        let newComment = {
            id: globalId,
            name,
            comment,
            votes,
            date: 'November 3, 2022'
        }
        console.log(newComment)
        comments.push(newComment)
        globalId++
        res.status(200).send(comments)
    },
    updateVotes: (req, res) => {
        let { id } = req.params
        let { type } = req.body
        let index = comments.findIndex(elem => +elem.id === +id)

       if (type === 'plus') {
            comments[index].votes += 1
            res.status(200).send(comments)
        } else if (type === 'minus') {
            comments[index].votes -= 1
            res.status(200).send(comments)
        } else {
            res.sendStatus(400)
        }
    }
};