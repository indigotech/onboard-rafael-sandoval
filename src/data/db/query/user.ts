import { User } from '@data/db/entity/user';
import { hash } from '@core/hash';
import { getConnection } from 'typeorm';

export const login = (email: string, password: string): Promise<User> => {
  const hashedPassword = hash(password);
  return getConnection()
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('email = :email and password = :hashedPassword', { email, hashedPassword })
    .getOne();
};
