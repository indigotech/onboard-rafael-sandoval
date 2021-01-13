import { Credentials } from '@graphql-schema/types';

export const Resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world';
    },
  },
  Mutation: {
    login: (_: unknown, { email, password }: Credentials) => {
      if (email && password) {
        return {
          user: {
            id: 10,
            name: 'Rafael Sandoval',
            email: 'rafael.sandoval@taqtile.com.br',
            birthDate: '05-15-1994',
            cpf: '12345678900',
          },
          token: 'ABCDEFGHI123',
        };
      }
    },
  },
};
