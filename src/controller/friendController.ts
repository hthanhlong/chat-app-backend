import { Request, Response } from 'express'
import FriendService from '../services/FriendService'
import MessageService from '../services/MessageService'
import WsService from '../services/WsService'

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { senderId, receiverId, status } = req.body
  FriendService.sendFriendRequest({ senderId, receiverId, status })
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Friend request sent',
    data: null
  })
}

export const getFriendRequest = async (req: Request, res: Response) => {
  const users = await FriendService.getFriendRequest(req.params.id)
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users
  })
}

export const updateStatusFriend = async (req: Request, res: Response) => {
  const { senderId, receiverId, status } = req.body
  const users = await FriendService.updateStatusFriend({
    senderId,
    receiverId,
    status
  })
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users
  })
}

export const getAllUsersNonFriends = async (req: Request, res: Response) => {
  const { userId } = req.body
  const users = await FriendService.getAllUsersNonFriends(userId)
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users
  })
}

export const getMyFriends = async (req: Request, res: Response) => {
  const users = await FriendService.getMyFriends(req.params.id)
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users
  })
}

export const searchFriendByKeyword = async (req: Request, res: Response) => {
  if (!req.query.q || !req.params.id) {
    res.status(400).json({
      isSuccess: false,
      errorCode: '400',
      message: 'Invalid query',
      data: null
    })
    return
  }
  const users = await FriendService.searchFriendByKeyword({
    id: req.params.id,
    keyword: req.query.q as string
  })
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all users',
    data: users
  })
}

export const unfriend = async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body
  await FriendService.unfriend({ senderId, receiverId })
  await MessageService.deleteAllMessage(senderId, receiverId)
  WsService.sendDataToClientById(receiverId, {
    type: 'UPDATE_FRIEND_LIST'
  })

  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Unfriend',
    data: null
  })
}
