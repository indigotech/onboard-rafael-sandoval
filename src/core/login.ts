import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

// Essa interface terá mais variaveis na próxima branch
interface TokenFields {
  id: number;
}

export const hash = (toHash: string): string => {
  return crypto.createHmac('sha256', 'SECRET').update(toHash).digest('hex');
};

export const createToken = (user: TokenFields): string => {
  const options = user.rememberMe ? { expiresIn: '1 week' } : {};
  return jwt.sign(user, 'SECRET', options);
};