import * as crypto from 'crypto';

export const hash = (toHash: string): string => {
  return crypto.createHmac('sha256', 'SECRET').update(toHash).digest('hex');
};
