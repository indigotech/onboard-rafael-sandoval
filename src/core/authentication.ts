import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

interface TokenFields {
  id: number;
  rememberMe: boolean;
}

export const hash = (toHash: string): string => {
  return crypto.createHmac('sha256', 'SECRET').update(toHash).digest('hex');
};

export const createToken = (user: TokenFields): string => {
  const options = user.rememberMe ? { expiresIn: '1 week' } : {};
  return jwt.sign({ id: user.id }, 'SECRET', options);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const checkAuth = (token: string): boolean => {
  try {
    const payload = jwt.verify(token, 'SECRET');
    if (new Date() > new Date(payload['exp'] * 1000)) {
      return false;
    }
    return Number.isFinite(payload['id']) ? true : false;
  } catch (error) {
    return false;
  }
};
