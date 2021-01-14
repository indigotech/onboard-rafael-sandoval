import assert = require('assert');
import { start } from 'setup';
import type { Express } from 'express';
import * as request from 'supertest';

let app: Express;

before(async () => {
  app = await start();
});

describe('Graphql', () => {
  describe('Query', () => {
    it('Hello world', (done) => {
      request(app)
        .post('/graphql')
        .send({ query: '{ hello }' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.strictEqual(res.body.data.hello, 'Hello world');
          done();
        });
    });
  });
});
