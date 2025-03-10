import { Response } from 'express'
import { WsService, FriendService, MessageService } from '../services'
import HttpException from '../../utils/httpExceptions'
import { IRequest } from '../../types'
class FriendController {
  async sendFriendRequest(req: IRequest, res: Response) {
    const { senderId, receiverId, status } = req.body
    FriendService.sendFriendRequest({ senderId, receiverId, status })
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Friend request sent',
      data: null
    })
  }

  getFriendRequest = async (req: IRequest, res: Response) => {
    const users = await FriendService.getFriendRequest(req.params.id)
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  updateStatusFriend = async (req: IRequest, res: Response) => {
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

  getAllUsersNonFriends = async (req: IRequest, res: Response) => {
    const { userId } = req.body
    const users = await FriendService.getAllUsersNonFriends(userId)
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  getMyFriends = async (req: IRequest, res: Response) => {
    const userId = req.query.id as string
    if (!userId) {
      throw HttpException.badRequestError()
    }
    const users = await FriendService.getMyFriends(userId)
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  searchFriendByKeyword = async (req: IRequest, res: Response) => {
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

  unFriend = async (req: IRequest, res: Response) => {
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
}

export default new FriendController()
