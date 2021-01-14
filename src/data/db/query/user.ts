import { User, IUser } from '@data/db/entity/user';
import { hash } from '@core/login';
import { DeleteResult, getRepository } from 'typeorm';

export const login = (email: string, password: string): Promise<User> => {
  const hashedPassword = hash(password);
  return getRepository(User).findOne({ email, password: hashedPassword });
};

export const createUser = async (userFields: IUser): Promise<User> => {
  const repo = getRepository(User);
  const user = repo.create(userFields);
  try {
    return await repo.save(user);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserByEmail = async (email: string): Promise<DeleteResult> => {
  return getRepository(User).delete({ email });
};
