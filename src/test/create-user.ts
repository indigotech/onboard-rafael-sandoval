import { CreateUserInput } from '@graphql-schema/types';
import { User, IUser } from '@data/db/entity/user';
import { createUser, deleteUserByEmail, getUserByEmail } from '@data/db/query/user';
import { createToken } from '@core/authentication';
import { userTest, checkUserStrings } from '@test';
import { expect } from 'chai';
import * as request from 'supertest';
import { getRepository } from 'typeorm';

let token: string;

const createTest = {
  ...userTest,
  email: 'rafael.sandoval2@taqtile.com.br',
};

const mutationCreateUser = `
  mutation CreateUser($user: CreateUserInput!) {
    CreateUser(user: $user) {
      id
      email
      name
      birthDate
      cpf
      password
    }
  }
`;

const testCreateUser = async (
  done: Mocha.Done,
  query: string,
  user: CreateUserInput,
  token: string,
  callback: (res: request.Response, userCreated: User, userCount: number) => void,
) => {
  try {
    const res = await request(`${process.env.URL}:${process.env.PORT}`)
      .post('/graphql')
      .send({
        query,
        variables: {
          user,
        },
      })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect('Content-Type', /json/);
    const userCreated = await getUserByEmail(createTest.email);
    const userCount = await getRepository(User).count();
    callback(res, userCreated, userCount);
    done();
  } catch (err) {
    return done(err);
  }
};

const checkCreatedUser = (user: User, test: IUser) => {
  checkUserStrings(user, test);
  expect(user.birthDate.toString()).to.equal(new Date(createTest.birthDate).toString());
};

const checkError = (obj: { message: string; code: number; data: any; errors: any; user: User; userCount: number }) => {
  expect(obj.errors.length).to.equal(1);
  expect(obj.errors[0].message).to.equal(obj.message);
  expect(obj.errors[0].code).to.equal(obj.code);
  expect(obj.data.CreateUser).to.equal(null);
  expect(obj.user).to.be.undefined;
  expect(obj.userCount).to.equal(1);
};

describe('Mutation CreateUser', () => {
  before(async () => {
    const user = await createUser(userTest);
    token = createToken({ id: user.id, rememberMe: true });
  });
  after(async () => {
    await deleteUserByEmail(userTest.email);
  });
  afterEach(async () => {
    await deleteUserByEmail(createTest.email);
  });
  it('Should create user when called with right parametes and authentication', (done) => {
    testCreateUser(done, mutationCreateUser, createTest, token, (res, user, userCount) => {
      const { data } = res.body;
      expect(userCount).to.equal(2);
      expect(user.id.toString()).to.equal(data.CreateUser.id);
      checkCreatedUser(user, createTest);
    });
  });

  it('Should return authorization error when unauthorized', (done) => {
    testCreateUser(done, mutationCreateUser, createTest, 'abc', (res, user, userCount) => {
      const { errors, data } = res.body;
      checkError({
        message: 'Unauthorized',
        code: 401,
        errors,
        data,
        user,
        userCount,
      });
    });
  });

  it('Should return email format error when email is not valid', (done) => {
    const test = { ...createTest, email: 'abcabc' };
    testCreateUser(done, mutationCreateUser, test, token, (res, user, userCount) => {
      const { errors, data } = res.body;
      checkError({
        message: 'Invalid email format',
        code: 400,
        errors,
        data,
        user,
        userCount,
      });
    });
  });

  it('Should return password error when password is not valid', (done) => {
    const test = { ...createTest, password: 'abcabc' };
    testCreateUser(done, mutationCreateUser, test, token, (res, user, userCount) => {
      const { errors, data } = res.body;
      checkError({
        message: 'Invalid Password',
        code: 400,
        errors,
        data,
        user,
        userCount,
      });
    });
  });

  it('Should return email already exist error when other user already has this email', (done) => {
    testCreateUser(done, mutationCreateUser, userTest, token, (res, user, userCount) => {
      const { errors, data } = res.body;
      checkError({
        message: 'Email already exists',
        code: 409,
        errors,
        data,
        user,
        userCount,
      });
    });
  });
});
