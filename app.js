const {getApi}=require('./controller/api.controller')
const { getTopics } = require('./controller/topics.controller')
const { getArticleById, getAllArticles} = require('./controller/articles.controller')
const express = require('express')
const app = express();

app.use(express.json())

app.get('/api/',getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  })




module.exports=app