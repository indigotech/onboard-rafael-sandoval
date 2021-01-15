import { Credentials, CreateUserInput } from '@graphql-schema/types';
import { getUserByEmail } from '@data/db/query/user';
import { createToken, hash, checkAuth } from '@core/authentication';
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
    CreateUser: (_: unknown, user: CreateUserInput, context) => {
      if (!checkAuth(context.token)) {
        throw new CustomError('Unauthorized', 401);
      }
      return {
        id: 3,
        name: 'name',
        email: 'email',
        birthDate: 'birthDate',
        cpf: 'cpf',
      };
    },
  },
};
