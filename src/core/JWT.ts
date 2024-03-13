import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_TIME,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  REFRESH_TOKEN_TIME,
} from '../config';

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

// export const async validate = (token: string) => {}
