const { fetchCommentsByArticleId } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
const { article_id } = req.params

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: 'invalid article id' })
  }

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return res.status(404).send({ msg: 'No comments' })
      }
      res.status(200).send({ comments })
    })
    .catch((err) => {
      next(err)
    })
}