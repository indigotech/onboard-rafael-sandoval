import { User, IUser } from '@data/db/entity/user';
import { expect } from 'chai';

export const userTest = {
  name: 'Rafael',
  email: 'rafael.sandoval@taqtile.com.br',
  birthDate: '05-15-1994',
  cpf: '12345678900',
  password: 'senha123',
};

export const checkUserError = (obj: {
  message: string;
  code: number;
  data: any;
  errors: any;
  userCreated: User;
  userCount: number;
}) => {
  expect(obj.errors.length).to.equal(1);
  expect(obj.errors[0].message).to.equal(obj.message);
  expect(obj.errors[0].code).to.equal(obj.code);
  expect(obj.data.createUser).to.equal(null);
  expect(obj.userCreated).to.be.undefined;
  expect(obj.userCount).to.equal(1);
};

export const checkError = (obj: { message: string; code: number; data: any; errors: any }) => {
  expect(obj.errors.length).to.equal(1);
  expect(obj.errors[0].message).to.equal(obj.message);
  expect(obj.errors[0].code).to.equal(obj.code);
  expect(obj.data.getUserById).to.equal(null);
};

interface IGraphqlUser extends IUser {
  birthDate: string;
}

export const checkUserStrings = (user: IGraphqlUser | IUser | User, userTest: IUser) => {
  expect(user.name).to.equal(userTest.name);
  expect(user.email).to.equal(userTest.email);
  expect(user.cpf).to.equal(userTest.cpf);
};

export const checkUser = (user: IGraphqlUser, userTest: IUser) => {
  checkUserStrings(user, userTest);
  expect(new Date(parseInt(user.birthDate)).toString()).to.equal(new Date(userTest.birthDate).toString());
};
