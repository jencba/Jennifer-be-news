const {getApi}=require('./controller/api.controller')
const { getTopics } = require('./controller/topics.controller')
const express = require('express')
const app = express();


app.get('/api/',getApi)
app.get('/api/topics', getTopics);

module.exports=app