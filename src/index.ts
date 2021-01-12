import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql-schema/schema';
import { resolvers } from './graphql-schema/resolver';

const app = express();

const server = new ApolloServer({
    typeDefs: schema,
    resolvers
});

server.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;
app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});