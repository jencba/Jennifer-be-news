const db = require('../db/connection');


exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
      `,
      [article_id]
    )
    .then(({ rows }) => rows);
};


exports.checkArticleExists = (article_id) => {
  const query = `
    SELECT * FROM articles WHERE article_id = $1;
  `
  return db.query(query, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      // If no articles are found, throw a 404 error
      return Promise.reject({ status: 404, msg: 'not found' })
    }
    return rows[0]
  })
}


exports.insertComment = (article_id, username, body) => {
  const query = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [article_id, username, body];

  return db
     .query(query, values)
    .then((result) => result.rows[0])
    .catch((err) => {
      if (err.code === '23503') {
        return Promise.reject({ status: 404, msg: 'not found' });
      }
      return Promise.reject(err);
    })
}


exports.checkCommentExists = (comment_id) => {
  const query = `
    SELECT * FROM comments WHERE comment_id = $1;
  `;
  return db.query(query, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Comment not found' });
    }
  })
}

exports.deleteCommentById = (comment_id) => {
  const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
  `;
  return db.query(query, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
  return Promise.reject({ status: 404, msg: 'Comment not found' })
    }
  })
}