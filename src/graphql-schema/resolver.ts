import { Credentials } from '@graphql-schema/types';
import { getUserByEmail } from '@data/db/query/user';
import { createToken, hash } from '@core/login';
import { emailValidation } from '@core/validation';
import { CustomError } from '@core/error-handling';

export const Resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world';
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password, rememberMe }: Credentials) => {
      if (!emailValidation(email)) {
        throw new CustomError('Email is in wrong format', 400);
      }
      const user = await getUserByEmail(email);
      if (!user) {
        throw new CustomError('Email or password is invalid', 401);
      }
      const hashedPassword = hash(password);
      if (hashedPassword !== user.password) {
        throw new CustomError('Email or password is invalid', 401);
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
