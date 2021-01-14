import { serverSetup } from '@graphql-schema/connection';
import * as dotenv from 'dotenv';
import * as express from 'express';

export const setEnv = () => {
  if (!process.env.NODE_ENV) {
    dotenv.config();
  }
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
};

export const start = async (): Promise<express.Express> => {
  const app = express();
  await serverSetup(app);
  return app;
};

export const listen = async () => {
  const app = await start();
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
};
