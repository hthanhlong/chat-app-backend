import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_TIME,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  REFRESH_TOKEN_TIME,
} from '../config';
import { Request, Response, NextFunction } from 'express';
import {
  AccessTokenExpired,
  BadTokenError,
  RefreshTokenExpired,
} from './ApiError';

export const generateToken = (payload: any) => {
  const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
    expiresIn: ACCESS_TOKEN_TIME,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
    expiresIn: REFRESH_TOKEN_TIME,
  });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  {
    try {
      const k = JWT_SECRET_ACCESS;
      if (!k) return console.log('k is not defined');
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new BadTokenError();
      const decoded = jwt.verify(token, k);
      req.decoded = decoded;
      next();
    } catch (error: Error | any) {
      if (error.message === 'Token is not valid') {
        next(new BadTokenError());
      }
      if (error.message === 'jwt expired') {
        next(new AccessTokenExpired());
      }
    }
  }
};

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  {
    try {
      const k = JWT_SECRET_REFRESH;
      if (!k) return console.log('k is not defined');
      const token = req.body.refreshToken;
      if (!token) throw new BadTokenError();
      const decoded = jwt.verify(token, k);
      req.decoded = decoded;
      next();
    } catch (error: Error | any) {
      if (error.message === 'Token is not valid') {
        next(new BadTokenError());
      }
      if (error.message === 'jwt expired') {
        next(new RefreshTokenExpired());
      }
    }
  }
};

//middleware to validate token
export const validateTokenWS = (
  type: string = 'ACCESS',
  accessToken: string,
) => {
  try {
    const k = type === 'ACCESS' ? JWT_SECRET_ACCESS : JWT_SECRET_REFRESH;
    const token = accessToken;
    if (!token) return null;
    const decoded = jwt.verify(token, k);
    return decoded;
  } catch (error: Error | any) {
    return null;
  }
};
