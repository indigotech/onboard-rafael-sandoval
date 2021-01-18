import { createUser, deleteUserByEmail } from '@data/db/query/user';
import { createToken } from '@core/authentication';
import { userTest, checkUser, checkError } from '@test/helpers/user';
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

const testGetUser = async (query: string, id: number, token: string): Promise<request.Response> => {
  try {
    return await request(`${process.env.URL}:${process.env.PORT}`)
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
  } catch (err) {
    throw err;
  }
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

  it('Should return an user when called with existing id and authorization', async () => {
    const res = await testGetUser(queryGetUser, id, token);
    const user = res.body.data.getUserById;
    checkUser(user, userTest);
    });

  it('Should return unauthorized when requested without valid token', async () => {
    const res = await testGetUser(queryGetUser, id, 'abc');
    const { data, errors } = res.body;
    checkError({
      message: 'Unauthorized',
      code: 401,
      data,
      errors,
    });
  });

  it('Should return "not found error" when requested id does not match an user', async () => {
    const res = await testGetUser(queryGetUser, 0, token);
    const { data, errors } = res.body;
    checkError({
      message: 'User not found',
      code: 404,
      data,
      errors,
    });
  });
});
