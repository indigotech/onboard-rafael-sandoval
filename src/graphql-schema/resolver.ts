import { CreateUserInput, Credentials } from '@graphql-schema/types';
import { getUserByEmail, createUser } from '@data/db/query/user';
import { createToken, hash, checkAuth } from '@core/authentication';
import { emailValidation, passwordValidation } from '@core/validation';
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
    CreateUser: async (_: unknown, { user }: { user: CreateUserInput }, context) => {
      if (!checkAuth(context.token)) {
        throw new CustomError('Unauthorized', 401);
      }
      if (!emailValidation(user.email)) {
        throw new CustomError('Invalid email format', 400);
      }
      if (!passwordValidation(user.password)) {
        throw new CustomError('Invalid Password', 400);
      }
      try {
        return await createUser(user);
      } catch (error) {
        if (error.code === '23505') {
          throw new CustomError('Email already exists', 409);
        }
      }
    },
  },
};
