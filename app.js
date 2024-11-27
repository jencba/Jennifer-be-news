const {getApi}=require('./controller/api.controller')
const { getTopics } = require('./controller/topics.controller')
const { getArticleById, getAllArticles, updateArticleVotes} = require('./controller/articles.controller')
const { getCommentsByArticleId, addComment } = require('./controller/comments.controller')

const express = require('express')
const app = express();

app.use(express.json())

app.get('/api/',getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', addComment)

app.delete('/api/comments/:comment_id', deleteComment)

app.patch('/api/articles/:article_id', updateArticleVotes)

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' })
  })

  app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ msg: err.msg || 'Internal Server Error' })
  })
  


module.exports=app