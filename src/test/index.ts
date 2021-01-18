import { createUser, deleteUserByEmail } from '@data/db/query/user';
import { decodeToken } from '@core/authentication';
import { userTest, checkUser } from '@test/helpers/user';
import { expect } from 'chai';
import { listen, setEnv } from 'setup';
import * as request from 'supertest';

const password = 'senha123';

const testGraphql = async (
  done: Mocha.Done,
  query: string,
  callback: (res: request.Response, base?: unknown) => void,
) => {
  try {
    const res = await request(`${process.env.URL}:${process.env.PORT}`)
      .post('/graphql')
      .send({
        query,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    callback(res);
    done();
  } catch (err) {
    return done(err);
  }
};

before(async () => {
  setEnv();
  await listen();
});

describe('Graphql', () => {
  describe('Query hello', () => {
    it('Hello world', (done) => {
      testGraphql(done, '{ hello }', (res) => {
        expect(res.body.data.hello).to.equal('Hello world');
      });
    });
  });

  const mutationQuery = (email: string, password: string, rememberMe?: boolean): string => {
    let args = `(email: "${email}", password: "${password}"`;
    args += rememberMe ? `, rememberMe: true)` : ')';
    return `mutation {
      login${args} {
        user {
          id
          email
          name
          birthDate
          cpf
        }
        token
      }
    }`;
  };

  beforeEach(async () => {
    await createUser(userTest);
  });
  afterEach(async () => {
    await deleteUserByEmail(userTest.email);
  });

  describe('Mutation login', () => {
    it('Should be possible to login with valid email and password', (done) => {
      testGraphql(done, mutationQuery(userTest.email, password), (res) => {
        const { user, token } = res.body.data.login;
        checkUser(user, userTest);
        const decoded = decodeToken(token);
        expect(parseInt(user.id)).to.equal(decoded.id);
        expect(decoded.exp).to.equal(undefined);
      });
    });

    it('Login with expiration option in the mutation should return token with expiration attribute', (done) => {
      testGraphql(done, mutationQuery(userTest.email, password, true), (res) => {
        const { user, token } = res.body.data.login;
        checkUser(user, userTest);
        const decoded = decodeToken(token);
        expect(parseInt(user.id)).to.equal(decoded.id);
        expect(decoded.exp).to.be.a('number');
        expect(new Date(decoded.exp * 1000) > new Date()).to.be.true;
      });
    });

    it('Try to login with email in wrong format should return an input error', (done) => {
      testGraphql(done, mutationQuery('rafael.sandoval', password), (res) => {
        const { errors, data } = res.body;
        expect(errors.length).to.equal(1);
        expect(errors[0].message).to.equal('Email is in wrong format');
        expect(errors[0].code).to.equal(400);
        expect(data.login).to.equal(null);
      });
    });

    it('Try to login with incorrect email should return an "invalid email" error', (done) => {
      testGraphql(done, mutationQuery('rafael@taqtile.com', password), (res) => {
        const { errors, data } = res.body;
        expect(errors.length).to.equal(1);
        expect(errors[0].message).to.equal('Email or password is invalid');
        expect(errors[0].code).to.equal(401);
        expect(data.login).to.equal(null);
      });
    });

    it('Try to login with incorrect password should return an "invalid password" error', (done) => {
      testGraphql(done, mutationQuery(userTest.email, 'senha1'), (res) => {
        const { errors, data } = res.body;
        expect(errors.length).to.equal(1);
        expect(errors[0].message).to.equal('Email or password is invalid');
        expect(errors[0].code).to.equal(401);
        expect(data.login).to.equal(null);
      });
    });
  });
});
