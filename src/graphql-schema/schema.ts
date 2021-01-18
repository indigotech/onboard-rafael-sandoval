import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
    password: String!
  }

  type Login {
    user: User!
    token: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
    password: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    login(email: String!, password: String!, rememberMe: Boolean): Login
    createUser(user: CreateUserInput!): User
  }
`;
