import { User } from '@data/db/entity/user';
import { createConnection, Connection } from 'typeorm';

export const dbConnection = (): Promise<Connection> => {
  const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME } = process.env;
  return createConnection({
    type: 'postgres',
    url: `postgress://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    entities: [User],
    synchronize: true,
  });
};
