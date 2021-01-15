import { Credentials } from '@graphql-schema/types';
import { login } from '@data/db/query/user';
import { createToken } from '@core/login';
import { emailValidation } from '@core/validation';
import { ApolloError, UserInputError } from 'apollo-server';

export const Resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world';
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password, rememberMe }: Credentials) => {
      if (!emailValidation(email)) {
        throw new UserInputError('Email is in wrong format', { status: '400' });
      }
      const user = await login(email, password);
      if (!user) {
        throw new ApolloError('Invalid email or password', 'INVALID_EMAIL_PASSWORD', { status: '401' });
      }
      const token = createToken({
        id: user.id,
        rememberMe,
      });
      return {
        user,
        token,
      };
    },
  },
};
