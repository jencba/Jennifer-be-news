const db = require('../db/connection');

exports.fetchAllUsers = () => {
const query = `
    SELECT username, name, avatar_url
    FROM users;
  `;
  
  return db.query(query)
    .then(({ rows }) => rows) 
    .catch((err) => {
      return Promise.reject({ status: 500, msg: 'Internal Server Error' })
    })
}
