import { CreateUserInput } from '@graphql-schema/types';
import { User, IUser } from '@data/db/entity/user';
import { createUser, deleteUserByEmail, getUserByEmail } from '@data/db/query/user';
import { createToken } from '@core/authentication';
import { userTest, checkUserStrings } from '@test';
import { checkUserError } from '@test/helpers/userCheck';
import { expect } from 'chai';
import * as request from 'supertest';
import { getRepository } from 'typeorm';

let token: string;

const createTest = {
  ...userTest,
  email: 'rafael.sandoval2@taqtile.com.br',
};

const mutationCreateUser = `
  mutation createUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      name
      birthDate
      cpf
    }
  }
`;

const testCreateUser = async (
  query: string,
  user: CreateUserInput,
  token: string,
): Promise<{ res: request.Response; userCreated: User; userCount: number }> => {
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
    return {
      res,
      userCreated,
      userCount,
    };
  } catch (error) {
    throw error;
  }
};

const checkCreatedUser = (user: User, test: IUser) => {
  checkUserStrings(user, test);
  expect(user.birthDate.toString()).to.equal(new Date(createTest.birthDate).toString());
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

  it('Should create user when called with right parametes and authentication', async () => {
    const { res, userCreated, userCount } = await testCreateUser(mutationCreateUser, createTest, token);
    const { data } = res.body;
    expect(userCount).to.equal(2);
    expect(userCreated.id.toString()).to.equal(data.createUser.id);
    checkCreatedUser(userCreated, createTest);
  });

  it('Should return authorization error when unauthorized', async () => {
    const { res, userCreated, userCount } = await testCreateUser(mutationCreateUser, createTest, 'abc');
    const { errors, data } = res.body;
    checkUserError({
      message: 'Unauthorized',
      code: 401,
      errors,
      data,
      userCreated,
      userCount,
    });
  });

  it('Should return email format error when email is not valid', async () => {
    const test = { ...createTest, email: 'abcabc' };
    const { res, userCreated, userCount } = await testCreateUser(mutationCreateUser, test, token);
    const { errors, data } = res.body;
    checkUserError({
      message: 'Invalid email format',
      code: 400,
      errors,
      data,
      userCreated,
      userCount,
    });
  });

  it('Should return password error when password is not valid', async () => {
    const test = { ...createTest, password: 'abcabc' };
    const { res, userCreated, userCount } = await testCreateUser(mutationCreateUser, test, token);
    const { errors, data } = res.body;
    checkUserError({
      message: 'Invalid Password',
      code: 400,
      errors,
      data,
      userCreated,
      userCount,
    });
  });

  it('Should return email already exist error when other user already has this email', async () => {
    const { res, userCreated, userCount } = await testCreateUser(mutationCreateUser, userTest, token);
    const { errors, data } = res.body;
    checkUserError({
      message: 'Email already exists',
      code: 409,
      errors,
      data,
      userCreated,
      userCount,
    });
  });
});
