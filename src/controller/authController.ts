import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { BadRequestError } from '../core/ApiError';

export const signupController = async (req: Request, res: Response) => {
  const { username, email } = req.body;

  const user = await AuthService.findUserByEmail(email);
  if (user !== null) {
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

export const loginController = async (req: Request, res: Response) => {
  const user = await AuthService.findUserByEmail(req.body.email);
  if (user === null) {
    throw new BadRequestError('Email or Password was not correctly');
  }

  const { password: hashedPassword, salt } = user;

  const isRightPassword = await AuthService.ValidatePassword(
    req.body.password,
    hashedPassword,
    salt,
  );

  if (!isRightPassword) {
    throw new BadRequestError('Email or Password was not correctly');
  }

  const data = await AuthService.login(user);

  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'login successful',
    data: data,
  });
};
