import { serverSetup } from '@graphql-schema/connection';
import * as express from 'express';

const app = express();

serverSetup(app);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
