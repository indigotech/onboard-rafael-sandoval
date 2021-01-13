import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

interface TokenFields {
  id: number;
}

export const hash = (toHash: string): string => {
  return crypto.createHmac('sha256', 'SECRET').update(toHash).digest('hex');
};

export const createToken = (user: TokenFields): string => {
  return jwt.sign(user, 'SECRET', { expiresIn: 600 });
};
