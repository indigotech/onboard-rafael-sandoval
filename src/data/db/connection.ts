import { User } from '@data/db/entity/user';
import { Address } from '@data/db/entity/address';
import { createConnection, Connection } from 'typeorm';

export const dbConnection = (): Promise<Connection> => {
  return createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [User, Address],
    synchronize: true,
  });
};
