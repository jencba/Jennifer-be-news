const { fetchCommentsByArticleId, insertComment, checkArticleExists } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
const { article_id } = req.params

const parsedArticleId = parseInt(article_id, 10);
if (isNaN(parsedArticleId)) {
  return res.status(400).send({ msg: 'Invalid article id' });
}

checkArticleExists(parsedArticleId)
.then(() => fetchCommentsByArticleId(parsedArticleId))
.then((comments) => {
  if(comments.length === 0){
    return res.status(404).send({ msg: 'No comments' })
  }
  res.status(200).send({ comments });
})
.catch(next)
}

exports.addComment = (req, res, next) => {
  const { article_id } = req.params
  const { username, body } = req.body

  const parsedArticleId = parseInt(article_id, 10)
  if (isNaN(parsedArticleId)) {
    return res.status(400).send({ msg: 'Invalid article id' })
  }


  if (!username || !body) {
    return res.status(400).send({ msg: 'Missing required fields' });
  }


  checkArticleExists(parsedArticleId)
    .then(() => insertComment(parsedArticleId, username, body))
  .then((newComment) => {
      res.status(201).send({ comment: newComment })
    })
    .catch(next)
}
