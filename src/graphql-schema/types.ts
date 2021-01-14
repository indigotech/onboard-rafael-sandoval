import { TokenFields } from '@core/login';

export interface Credentials extends TokenFields {
  email: string;
  password: string;
}
