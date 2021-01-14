import { createUser, deleteUserByEmail } from '@data/db/query/user';
import { hash, decodeToken } from '@core/login';
import { expect } from 'chai';
import { start, setEnv } from 'setup';
import type { Express } from 'express';
import * as request from 'supertest';

let app: Express;

const testGraphql = (done: Mocha.Done, query: string, callback: (res: request.Response) => void) => {
  request(app)
    .post('/graphql')
    .send({
      query,
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      callback(res);
      done();
    });
};

before(async () => {
  setEnv();
  app = await start();
});

beforeEach(async () => {
  const user = {
    name: 'Rafael',
    email: 'rafael.sandoval@taqtile.com.br',
    birthDate: new Date('05-15-1994'),
    cpf: '12345678900',
    password: hash('senha123'),
  };
  await createUser(user);
});

afterEach(async () => {
  await deleteUserByEmail('rafael.sandoval@taqtile.com.br');
});

describe('Graphql', () => {
  describe('Query hello', () => {
    it('Hello world', (done) => {
      testGraphql(done, '{ hello }', (res) => {
        expect(res.body.data.hello).to.equal('Hello world');
      });
    });
  });

  describe('Mutation login', () => {
    it('Simple Login', (done) => {
      testGraphql(
        done,
        `mutation {
          login(email: "rafael.sandoval@taqtile.com.br", password: "senha123") {
            user {
              id
              email
            }
            token
          }
        }`,
        (res) => {
          const { user, token } = res.body.data.login;
          expect(user.email).to.equal('rafael.sandoval@taqtile.com.br');
          const decoded = decodeToken(token);
          expect(parseInt(user.id)).to.equal(decoded['id']);
          expect(decoded['exp']).to.equal(undefined);
        },
      );
    });
    it('Login with 1 week token', (done) => {
      testGraphql(
        done,
        `mutation {
          login(email: "rafael.sandoval@taqtile.com.br", password: "senha123", rememberMe: true) {
            user {
              id
              email
            }
            token
          }
        }`,
        (res) => {
          const { user, token } = res.body.data.login;
          expect(user.email).to.equal('rafael.sandoval@taqtile.com.br');
          const decoded = decodeToken(token);
          expect(parseInt(user.id)).to.equal(decoded['id']);
          expect(decoded['exp']).to.be.a('number');
        },
      );
    });
    it('Email in wrong format', (done) => {
      testGraphql(
        done,
        `mutation {
          login(email: "rafael.sandoval", password: "senha123") {
            user {
              id
              email
            }
            token
          }
        }`,
        (res) => {
          const { errors, data } = res.body;
          expect(errors.length).to.equal(1);
          expect(errors[0].message).to.equal('Email is in wrong format');
          expect(errors[0].extensions.code).to.equal('BAD_USER_INPUT');
          expect(errors[0].extensions.status).to.equal('400');
          expect(data.login).to.equal(null);
        },
      );
    });
    it('Email not found', (done) => {
      testGraphql(
        done,
        `mutation {
          login(email: "rafael.sandoval@taqtile.com", password: "senha123") {
            user {
              id
              email
            }
            token
          }
        }`,
        (res) => {
          const { errors, data } = res.body;
          expect(errors.length).to.equal(1);
          expect(errors[0].message).to.equal('Invalid email or password');
          expect(errors[0].extensions.code).to.equal('INVALID_EMAIL_PASSWORD');
          expect(errors[0].extensions.status).to.equal('401');
          expect(data.login).to.equal(null);
        },
      );
    });
    it('Incorrect password', (done) => {
      testGraphql(
        done,
        `mutation {
          login(email: "rafael.sandoval@taqtile.com.br", password: "senha1") {
            user {
              id
              email
            }
            token
          }
        }`,
        (res) => {
          const { errors, data } = res.body;
          expect(errors.length).to.equal(1);
          expect(errors[0].message).to.equal('Invalid email or password');
          expect(errors[0].extensions.code).to.equal('INVALID_EMAIL_PASSWORD');
          expect(errors[0].extensions.status).to.equal('401');
          expect(data.login).to.equal(null);
        },
      );
    });
  });
});
