import { createUser, deleteUserByEmail } from '@data/db/query/user';
import { createToken } from '@core/authentication';
import { userTest, checkUser } from '@test';
import { expect } from 'chai';
import * as request from 'supertest';

let id: number;
let token: string;

const queryGetUser = `
  query getUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      cpf
      birthDate
    }
  }
`;

const testGetUser = async (
  done: Mocha.Done,
  query: string,
  id: number,
  token: string,
  callback: (res: request.Response) => void,
) => {
  try {
    const res = await request(`${process.env.URL}:${process.env.PORT}`)
      .post('/graphql')
      .send({
        query,
        variables: {
          id,
        },
      })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect('Content-Type', /json/);
    callback(res);
    done();
  } catch (err) {
    return done(err);
  }
};

const checkError = (obj: { message: string; code: number; data: any; errors: any }) => {
  expect(obj.errors.length).to.equal(1);
  expect(obj.errors[0].message).to.equal(obj.message);
  expect(obj.errors[0].code).to.equal(obj.code);
  expect(obj.data.getUserById).to.equal(null);
};

describe('Query getUserById', () => {
  beforeEach(async () => {
    const newUser = await createUser(userTest);
    id = newUser.id;
    token = createToken({ id: newUser.id, rememberMe: true });
  });
  afterEach(async () => {
    await deleteUserByEmail(userTest.email);
  });
  it('Should return an user when called with existing id and authorization', (done) => {
    testGetUser(done, queryGetUser, id, token, (res) => {
      const user = res.body.data.getUserById;
      checkUser(user, userTest);
    });
  });

  it('Should return unauthorized when requested without valid token', (done) => {
    testGetUser(done, queryGetUser, id, 'abc', (res) => {
      const { data, errors } = res.body;
      checkError({
        message: 'Unauthorized',
        code: 401,
        data,
        errors,
      });
    });
  });

  it('Should return "not found error" when requested id does not match an user', (done) => {
    testGetUser(done, queryGetUser, 0, token, (res) => {
      const { data, errors } = res.body;
      checkError({
        message: 'User not found',
        code: 404,
        data,
        errors,
      });
    });
  });
});
