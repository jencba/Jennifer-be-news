const endpointsJson = require("../endpoints.json");
const app= require('../app')
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');
require('jest-sorted');
/* Set up your test imports here */
/* Set up your beforeEach & afterAll functions here */


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
  test("200: Responds with an array of article each with the correct properties", () => {
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


describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for a given article_id, each comment with correct properties", () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11)
        comments.forEach((comment) => {
          expect(comment).toMatchObject(
            {
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            }
          )
        })
      })
  })

  test("404: if no comments are found for the given article_id, respond with an errror", () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No comments')
      })
  })

  test("400: if given an invalid article_id, respond with an error", () => {
    return request(app)
      .get('/api/articles/bananas/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid article id')
      })
  })

  test("200: Responds with comments sorted by most recent first", () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy('created_at', { descending: true })
      })
  })
})