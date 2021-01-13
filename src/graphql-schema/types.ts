import { TokenFields } from '@core/login';

export interface Credentials extends TokenFields {
  password: string;
}
