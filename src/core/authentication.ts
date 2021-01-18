import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

interface TokenFields {
  id: number;
  rememberMe: boolean;
}

interface IPayload {
  id: number;
  iat: number;
  exp: number;
}

export const hash = (toHash: string): string => {
  return crypto.createHmac('sha256', process.env.HASH_SECRET).update(toHash).digest('hex');
};

export const createToken = (user: TokenFields): string => {
  const options = user.rememberMe ? { expiresIn: '1 week' } : {};
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, options);
};

export const decodeToken = (token: string): IPayload => {
  const payload = jwt.decode(token);
  return {
    id: payload['id'],
    iat: payload['iat'],
    exp: payload['exp'],
  };
};

export const verifyToken = (token: string, secrect: string): IPayload => {
  const payload = jwt.verify(token, secrect);
  return {
    id: payload['id'],
    iat: payload['iat'],
    exp: payload['exp'],
  };
};

export const checkAuth = (token: string): boolean => {
  try {
    const payload = verifyToken(token, process.env.JWT_SECRET);
    const isExpired = new Date() > new Date(payload.exp * 1000);
    return !isExpired && Number.isFinite(payload.id);
  } catch (error) {
    return false;
  }
};
