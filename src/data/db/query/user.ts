import { User } from '@data/db/entity/user';
import { hash } from '@core/hash';
import { getConnection } from 'typeorm';

export const login = async (email: string, password: string): Promise<User> => {
  const hashedPassword = hash(password);
  return await getConnection()
    .createQueryBuilder()
    .select('user')
    .from(User, 'user')
    .where('email = :email and password = :hashedPassword', { email, hashedPassword })
    .getOne();
};
