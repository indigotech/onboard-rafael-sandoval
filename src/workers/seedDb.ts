import { dbConnection } from '@data/db/connection';
import { userSeed } from '@data/db/seed/user';
import { setEnv } from 'setup';

const insertSeed = async () => {
  setEnv();
  await dbConnection();
  await userSeed();
  console.log('userSeed inserted!');
};

insertSeed();
