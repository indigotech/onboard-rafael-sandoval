import { serverSetup } from '@graphql-schema/connection';
import * as express from 'express';

export const start = async (): Promise<express.Express> => {
  const app = express();
  await serverSetup(app);
  return app;
};

const listen = async () => {
  const app = await start();
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
};

listen();
