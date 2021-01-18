import { User } from '@data/db/entity/user';
import { expect } from 'chai';

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