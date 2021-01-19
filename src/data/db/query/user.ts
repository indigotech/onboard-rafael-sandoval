import { User } from '@data/db/entity/user';
import { hash } from '@core/authentication';
import { DeleteResult, getRepository } from 'typeorm';
import { CreateUserInput } from '@graphql-schema/types';

export const getUsers = (limit: number, offset: number): Promise<[User[], number]> => {
  return getRepository(User).findAndCount({
    order: { name: 'ASC' },
    take: limit,
    skip: offset,
  });
};

export const getUserById = (id: number): Promise<User> => {
  return getRepository(User).findOne({ id });
};

export const getUserByEmail = (email: string): Promise<User> => {
  return getRepository(User).findOne({ email });
};

export const createUser = async (user: CreateUserInput): Promise<User> => {
  const repo = getRepository(User);
  const userEntity = repo.create({ ...user, password: hash(user.password) });
  return repo.save(userEntity);
};

export const deleteUserByEmail = async (email: string): Promise<DeleteResult> => {
  return getRepository(User).delete({ email });
};

export const deleteAllUsers = async () => {
  return getRepository(User).delete({});
};
