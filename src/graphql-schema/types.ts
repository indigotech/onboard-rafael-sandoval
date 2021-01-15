export interface Credentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CreateUserInput {
  name: string;
  email: string;
  birthDate: string;
  cpf: string;
  password: string;
}
