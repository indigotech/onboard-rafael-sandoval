import { User } from '@data/db/entity/user';
import { hash } from '@core/hash';
import { getRepository } from 'typeorm';

export const login = (email: string, password: string): Promise<User> => {
  const hashedPassword = hash(password);
  return getRepository(User).findOne({ email, password: hashedPassword });
};
