import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
    addresses: [Address]
  }

  type Address {
    id: ID!
    cep: String!
    street: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
  }

  type PageInfo {
    count: Int!
    passed: Int!
    remaining: Int!
  }

  type Users {
    info: PageInfo!
    users: [User]!
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
    getUserById(id: ID!): User
    users(limit: Int, offset: Int): Users
  }

  type Mutation {
    login(email: String!, password: String!, rememberMe: Boolean): Login
    createUser(user: CreateUserInput!): User
  }
`;
