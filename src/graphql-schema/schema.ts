import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: ID!
    name: String
    email: String
    birthDate: String
    cpf: String
  }

  type Login {
    user: User
    token: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    login(email: String, password: String): Login
  }
`;
