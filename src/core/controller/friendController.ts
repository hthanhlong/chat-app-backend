import { Response } from 'express'
import { WsService, FriendService, MessageService } from '../services'
import HttpException from '../../utils/httpExceptions'
import { IRequest } from '../../types'
import logger from '../../utils/logger'

const _logger = logger('FriendController')

class FriendController {
  async sendFriendRequest(req: IRequest, res: Response) {
    const { senderId, receiverId, status } = req.body
    FriendService.sendFriendRequest({ senderId, receiverId, status })

    _logger(req).info('Send friend request successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Friend request sent',
      data: null
    })
  }

  getFriendRequest = async (req: IRequest, res: Response) => {
    const users = await FriendService.getFriendRequest(req.params.id)

    _logger(req).info('Get friend request successful', {
      data: users
    })

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

    _logger(req).info('Update status friend successful', {
      data: users
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'update status friend successfully',
      data: users
    })
  }

  getAllUsersNonFriends = async (req: IRequest, res: Response) => {
    const { userId } = req.body
    const users = await FriendService.getAllUsersNonFriends(userId)

    _logger(req).info('Get all users non friends successful', {
      data: users
    })

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

    _logger(req).info('Get my friends successful', {
      data: users
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  searchFriendByKeyword = async (req: IRequest, res: Response) => {
    const { id, keyword } = req.query

    if (!id || !keyword) {
      _logger(req).error('Invalid query')

      res.status(400).json({
        isSuccess: false,
        errorCode: '400',
        message: 'Invalid query',
        data: null
      })
      return
    }
    const users = await FriendService.searchFriendByKeyword({
      id: id as string,
      keyword: keyword as string
    })

    _logger(req).info('Search friend by keyword successful', {
      data: users
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

    _logger(req).info('Unfriend successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Unfriend successfully',
      data: null
    })
  }
}

export default new FriendController()
