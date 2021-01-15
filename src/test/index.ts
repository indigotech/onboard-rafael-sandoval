import { createUser, deleteUserByEmail } from '@data/db/query/user';
import { IUser } from '@data/db/entity/user';
import { decodeToken, hash } from '@core/authentication';
import { expect } from 'chai';
import { start, setEnv } from 'setup';
import type { Express } from 'express';
import * as request from 'supertest';

let app: Express;

const userTest = {
  name: 'Rafael',
  email: 'rafael.sandoval@taqtile.com.br',
  birthDate: '05-15-1994',
  cpf: '12345678900',
  password: 'senha123',
};

const password = 'senha123';

interface IGraphqlUser extends IUser {
  birthDate: string;
}

const checkUser = (user: IGraphqlUser, userTest: IUser) => {
  expect(user.name).to.equal(userTest.name);
  expect(user.email).to.equal(userTest.email);
  expect(new Date(parseInt(user.birthDate)).toString()).to.equal(new Date(userTest.birthDate).toString());
  expect(user.cpf).to.equal(userTest.cpf);
  expect(user.password).to.equal(hash(userTest.password));
};

const testGraphql = async (
  done: Mocha.Done,
  query: string,
  callback: (res: request.Response, base?: unknown) => void,
) => {
  try {
    const res = await request(app)
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
  app = await start();
});

beforeEach(async () => {
  await createUser(userTest);
});

afterEach(async () => {
  await deleteUserByEmail(userTest.email);
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
          password
        }
        token
      }
    }`;
  };

  describe('Mutation login', () => {
    it('Should be possible to login with valid email and password', (done) => {
      testGraphql(done, mutationQuery(userTest.email, password), (res) => {
        const { user, token } = res.body.data.login;
        checkUser(user, userTest);
        const decoded = decodeToken(token);
        expect(parseInt(user.id)).to.equal(decoded['id']);
        expect(decoded['exp']).to.equal(undefined);
      });
    });

    it('Login with expiration option in the mutation should return token with expiration attribute', (done) => {
      testGraphql(done, mutationQuery(userTest.email, password, true), (res) => {
        const { user, token } = res.body.data.login;
        checkUser(user, userTest);
        const decoded = decodeToken(token);
        expect(parseInt(user.id)).to.equal(decoded['id']);
        expect(decoded['exp']).to.be.a('number');
        expect(new Date(decoded['exp'] * 1000) > new Date()).to.be.true;
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
