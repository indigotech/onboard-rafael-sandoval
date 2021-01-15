import { User, IUser } from '@data/db/entity/user';
import { DeleteResult, getRepository } from 'typeorm';

export const getUserByEmail = (email: string): Promise<User> => {
  return getRepository(User).findOne({ email });
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
