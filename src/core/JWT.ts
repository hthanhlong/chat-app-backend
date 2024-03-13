import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_TIME,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  REFRESH_TOKEN_TIME,
} from '../config';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './ApiError';

export const generateToken = (payload: any) => {
  const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
    expiresIn: ACCESS_TOKEN_TIME,
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
    expiresIn: REFRESH_TOKEN_TIME,
  });

  return { accessToken, refreshToken };
};

// export const async decode = (token: string) =>  {}

export const validateToken =
  (type: string = 'ACCESS') =>
  (req: Request, res: Response, next: NextFunction) => {
    {
      try {
        const k = type === 'ACCESS' ? JWT_SECRET_ACCESS : JWT_SECRET_REFRESH;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new BadRequestError('Token not found');
        const decoded = jwt.verify(token, k);
        req.decoded = decoded;
        next();
      } catch (error) {
        next(error);
      }
    }
  };
