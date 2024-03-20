import { Request, Response } from 'express';
import FriendService from '../services/FriendService';

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { senderId, receiverId, status } = req.body;
  FriendService.sendFriendRequest({ senderId, receiverId, status });
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Friend request sent',
    data: null,
  });
};

export const getAllUsersNonFriends = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const users = await FriendService.getAllUsersNonFriends(userId);
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users,
  });
};

export const getFriendRequest = async (req: Request, res: Response) => {
  const users = await FriendService.getFriendRequest(req.params.id);
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users,
  });
};
