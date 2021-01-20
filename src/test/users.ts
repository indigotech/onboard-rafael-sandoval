import { deleteAllUsers, getUsers } from '@data/db/query/user';
import { userSeed } from '@data/db/seed/user';
import { createToken } from '@core/authentication';
import { checkUser, IGraphqlUser } from '@test/helpers/user';
import { expect } from 'chai';
import * as request from 'supertest';

let token: string;
const count = 50;

const queryUsers = `
  query users($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      info {
        count
        passed
        remaining
      }
      users {
        id
        name
        email
        birthDate
        cpf
        addresses {
          id
          cep
          street
          streetNumber
          complement
          neighborhood
          city
          state
        }
      }
    }
  }
`;

const testUsers = async (query: string, token: string, limit?: number, offset?: number): Promise<request.Response> => {
  return request(`${process.env.URL}:${process.env.PORT}`)
    .post('/graphql')
    .send({
      query,
      variables: {
        limit,
        offset,
      },
    })
    .set('Accept', 'application/json')
    .set('Authorization', token)
    .expect('Content-Type', /json/);
};

describe('Query Users', () => {
  before(async () => {
    await userSeed();
    token = createToken({ id: 1, rememberMe: true });
  });

  after(async () => {
    await deleteAllUsers();
  });

  it('Should return users 1~10 when called with limit=10 and offset=0', async () => {
    const res = await testUsers(queryUsers, token, 10, 0);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 0, remaining: 40 });
    const [userDb] = await getUsers(10, 0);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 11~20 when called with limit=10 and offset=10', async () => {
    const res = await testUsers(queryUsers, token, 10, 10);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 10, remaining: 30 });
    const [userDb] = await getUsers(10, 10);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 41~50 when called with limit=10 and offset=40', async () => {
    const res = await testUsers(queryUsers, token, 10, 40);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 40, remaining: 0 });
    const [userDb] = await getUsers(10, 40);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 46~50 when called with limit=10 and offset=45', async () => {
    const res = await testUsers(queryUsers, token, 10, 45);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 45, remaining: 0 });
    const [userDb] = await getUsers(10, 45);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 1~50 when called with limit=100 and offset=0', async () => {
    const res = await testUsers(queryUsers, token, 100, 0);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 0, remaining: 0 });
    const [userDb] = await getUsers(100, 0);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should not return users when called with limit=10 and offset=60', async () => {
    const res = await testUsers(queryUsers, token, 10, 60);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 50, remaining: 0 });
    const [userDb] = await getUsers(10, 60);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 1~20 when called with limit=20 and without offset', async () => {
    const res = await testUsers(queryUsers, token, 20);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 0, remaining: 30 });
    const [userDb] = await getUsers(20, 0);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 21~30 when called without limit and offset=20', async () => {
    const res = await testUsers(queryUsers, token, undefined, 20);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 20, remaining: 20 });
    const [userDb] = await getUsers(10, 20);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });

  it('Should return users 1~10 when called without limit and offset', async () => {
    const res = await testUsers(queryUsers, token);
    const { users, info } = res.body.data.users;
    expect(info).to.be.deep.eq({ count, passed: 0, remaining: 40 });
    const [userDb] = await getUsers(10, 0);
    users.map((user: IGraphqlUser, ind: number) => {
      checkUser(user, userDb[ind]);
    });
  });
});
