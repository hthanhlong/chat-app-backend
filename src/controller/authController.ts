import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { BadRequestError } from '../core/ApiError';

export const signupController = async (req: Request, res: Response) => {
  const { username, email } = req.body;

  const isExistEmail = await AuthService.findUserByEmail(email);
  if (isExistEmail) {
    throw new BadRequestError('Email already exists');
  }

  const isExistUsername = await AuthService.findUserByUsername(username);
  if (isExistUsername) {
    throw new BadRequestError('Username already exists');
  }
  
  await AuthService.signup(req.body);

  res.status(201).json({
    isSuccess: true,
    errorCode: null,
    message: 'Signup successful',
    data: null,
  });
};
