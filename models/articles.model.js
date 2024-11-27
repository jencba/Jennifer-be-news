const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  return db.query(
      'SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1',
      [article_id]
    )
    .then((result) => {
    
      return result.rows[0]
    })
}

exports.fetchAllArticles = () => {
    return db.query(`
        SELECT articles.article_id, articles.author, articles.title, articles.topic, 
               articles.created_at, articles.votes, articles.article_img_url, 
               COUNT(comments.article_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
      `)
      .then(({ rows }) => {
    
        return rows
      })
    }

exports.updateArticleVotes = (articleId, incVotes) => {
        return db
          .query(
            `UPDATE articles 
             SET votes = votes + $1 
             WHERE article_id = $2 
             RETURNING *`,
            [incVotes, articleId]
          )
          .then((result) => {
            if (result.rows.length === 0) {
              return null
            }
            return result.rows[0]
          })
      }