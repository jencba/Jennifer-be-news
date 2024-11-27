const { fetchArticleById, fetchAllArticles, updateArticleVotes } = require('../models/articles.model');


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

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err)
      });
    }

exports.updateArticleVotes = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
const parsedArticleId = parseInt(article_id, 10)
    if (isNaN(parsedArticleId)) {
      return res.status(400).send({ msg: 'Invalid article id' })
    }
  
    updateArticleVotes(parsedArticleId, inc_votes)
      .then((updatedArticle) => {
        if (!updatedArticle) {
          return res.status(404).send({ msg: 'Article not found' })
        }
        res.status(200).send({ article: updatedArticle })
      })
      .catch(next)

  }