const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app= require('../app')
const request = require('supertest');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  return db.end();
})


describe.skip("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe.skip("GET /api/topics", () => {
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

describe.skip("GET /api/articles/:article_id", () => {
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

describe.skip("GET /api/articles", () => {
  test("200: Responds with an array of article each with the correct properties", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(article).toHaveLength(13)
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

  test("404: Responds with an error if the route does not exist", () => {
    return request(app)
      .get('/api/nonexistent')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found')
      })
  })

  // You could also add tests for other edge cases here if necessary
})