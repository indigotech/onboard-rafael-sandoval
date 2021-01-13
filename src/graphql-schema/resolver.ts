import { Credentials } from '@graphql-schema/types';
import { login } from '@data/db/query/user';
import { createToken } from '@core/login';

export const Resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world';
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password }: Credentials) => {
      const user = await login(email, password);
      const token = createToken({
        id: user.id,
      });
      return {
        user,
        token,
      };
    },
  },
};
