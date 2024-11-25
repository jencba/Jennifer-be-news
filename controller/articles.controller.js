const { fetchArticleById } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params

 
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: 'invalid article id' })
  }

  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: 'article not found' })
      }
      res.status(200).send({ article })
    })
    .catch((err) => {
      next(err)
    })
}

