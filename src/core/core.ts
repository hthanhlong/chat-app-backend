import { NextFunction, Response, Request } from 'express';
import { NotFoundError } from './ApiError';

export const handleNotFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new NotFoundError());
};
