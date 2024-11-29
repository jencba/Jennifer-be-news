const endpointsJson = require("../endpoints.json");
const app= require('../app')
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');
require('jest-sorted');

beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  return db.end();
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics, each with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toMatchObject(
           {slug: expect.any(String),
            description: expect.any(String),
            }
          )
        })
      })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object each with the correct properties", () => {
    return request(app)
      .get('/api/articles/1')  
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject
        ({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
          })
       
      })
  })

  test("404: if articles doesnt exist, respond with error", () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('article not found')
      })
  })

  test("400: if given invaid id respond with error", () => {
    return request(app)
      .get('/api/articles/bananas')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid article id')
      })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of article each with the correct properties, automatically sorted by created by, descending ", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13)
        articles.forEach((article) => {
          expect(article).toMatchObject(
            {
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            }
          )
        })
        expect(articles).toBeSortedBy('created_at', { descending: true })
      })
  })

  test("200:responds with articles sorted by a certain property in descending order by default", () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('votes',{ descending: true });
      })
  })

  test("200: responds with articles sorted by a certain  property in ascending order", () => {
    return request(app)
      .get('/api/articles?sort_by=votes&order=asc')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('votes',{ ascending: true });
      })
  })

  test("200: responds with articles filtered by a chosen topic ", () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12)
        articles.forEach((article) => {
          expect(article.topic).toBe('mitch')
        })
      })
  })

  test("404: responds with error if the route doesn't exist", () => {
    return request(app)
      .get('/api/banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found')
      })
  })
})


describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'comment',
    }

    return request(app)
       .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          author: 'butter_bridge',
          body: 'comment',
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
        })
      })
  })

  test("404: Responds with error if the article_id does not exist", () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'non-existent id',
    }

    return request(app)
      .post('/api/articles/999999/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('not found');
      })
  })

  test("400: Responds with error if the article_id is invalid", () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'Invalid ID',
    }

    return request(app)
      .post('/api/articles/bananas/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article id');
      })
  })

  test("400: respond with erro if there is no username or comment", () => {
    const newComment = { username: 'butter_bridge' }

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Missing required fields')
      })
  })
})

 

describe('PATCH /api/articles/:article_id', () => {
  
  test('200: Successfully update votes when votes are provided', () => {
    const updateVotes = { inc_votes: 5 }
    
    return request(app)
      .patch('/api/articles/1')  
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBeGreaterThan(0)
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
          title: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),

          created_at: expect.any(String),
        })
      })
  })

})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes a comment by its ID", () => {
    return request(app)
      .delete('/api/comments/1') 
      .expect(204)
  })

  
  test("404:responds with error if the comment does not exist", () => {
    return request(app)
      .delete('/api/comments/999999')
      .expect(404) 
      .then(({ body }) => {
        expect(body.msg).toBe('Comment not found')
      })
  })

  test("400: Responds with error if commentid is invalid", () => {
    return request(app)
      .delete('/api/comments/banana') 
      .expect(400) 
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment ID')

      })
    })

  test('400: responds with error if article id is invalid', () => {
    const updateVotes = { inc_votes: 1 }
    
    return request(app)
      .patch('/api/articles/bananas')
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article id')
      })
  })



 
})

describe("GET /api/users", () => {
    test("200: responds with an array of users with their properties properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4)
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          })
        })
    })

  
  
})