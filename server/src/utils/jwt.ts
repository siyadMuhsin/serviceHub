import { rejects } from 'assert';
import jwt from 'jsonwebtoken'
import { resolve } from 'path';
export interface TokenPayload {
    userId: string;
    role: string;
    expertId?: string; // Optional, only included for expert role
  }
export const generateAccessToken = (userId: string, role: string, expertId?: string) => {
  const payload: TokenPayload = { userId, role };
  if (expertId) payload.expertId = expertId; // Include expertId if provided
  return jwt.sign(payload, process.env.ACCESS_SECRET as string, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string, role: string, expertId?: string) => {
  const payload: TokenPayload = { userId, role };
  if (expertId) payload.expertId = expertId; // Include expertId if provided
  return jwt.sign(payload, process.env.REFRESH_SECRET as string, { expiresIn: '7d' });
};

export const TokenVerify = (token: string, secret: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as TokenPayload); // Cast the decoded payload to TokenPayload
      });
    });
  }