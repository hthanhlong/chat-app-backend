import { Request, Response } from 'express';
import UserService from '../services/UserService';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users,
  });
};
