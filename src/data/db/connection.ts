import { User } from '@data/db/entity/user';
import { createConnection, Connection } from 'typeorm';

export const dbConnection = (): Promise<Connection> => {
  return createConnection({
    type: 'postgres',
    url: 'postgress://admin:admin@localhost:5432/localdb',
    entities: [User],
    synchronize: true,
  });
};
