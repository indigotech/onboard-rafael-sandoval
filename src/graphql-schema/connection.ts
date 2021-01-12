import { dbConnection } from '@data/db/connection';
import { Resolvers } from '@graphql-schema/resolver';
import { schema } from '@graphql-schema/schema';
import { ApolloServer } from 'apollo-server-express';
import type { Express } from 'express';

export const serverSetup = async (app: Express) => {
  await dbConnection();
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: Resolvers,
  });
  server.applyMiddleware({ app, path: '/graphql' });
};
