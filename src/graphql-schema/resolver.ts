import { Credentials } from '@graphql-schema/types';
import { login } from '@data/db/query/user';

export const Resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world';
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password }: Credentials) => {
      const user = await login(email, password);
      return {
        user,
        token: 'ABCDEFGHI123',
      };
    },
  },
};
