import { User } from '@data/db/entity/user';
import { createConnection, Connection } from 'typeorm';

export const dbConnection = (): Promise<Connection> => {
  return createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [User],
    synchronize: true,
  });
};
