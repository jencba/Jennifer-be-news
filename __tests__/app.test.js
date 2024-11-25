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
       console.log(topics)
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