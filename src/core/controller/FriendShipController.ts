import { Response } from 'express'
import { WsService, FriendShipService, MessageService } from '../services'
import { IRequest } from '../../types'
import logger from '../../utils/logger'

const _logger = logger('FriendShipController')

class FriendShipController {
  addFriend = async (req: IRequest, res: Response) => {
    const { userId: senderId } = req.decoded
    const { receiverId, status } = req.body
    await FriendShipService.addFriend({ senderId, receiverId, status })

    _logger(req).info('Send friend request successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Friend request sent',
      data: null
    })
  }

  getFriendRequest = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    const users = await FriendShipService.getFriendRequest(userId)

    _logger(req).info('Get friend request successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get friend request successful',
      data: users
    })
  }

  updateStatusFriend = async (req: IRequest, res: Response) => {
    const { userId: senderId } = req.decoded
    const { receiverId, status } = req.body

    const result = await FriendShipService.updateStatusFriend({
      senderId,
      receiverId,
      status
    })

    if (!result) {
      _logger(req).error('Update status friend failed')
      res.status(400).json({
        isSuccess: false,
        errorCode: '400',
        message: 'Update status friend failed',
        data: null
      })
    }

    _logger(req).info('Update status friend successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'update status friend successfully',
      data: null
    })
  }

  getAllUsersNonFriends = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    console.log('userId', userId)
    const users = await FriendShipService.getAllUsersNonFriends(userId)
    _logger(req).info('Get all users non friends successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  getFriends = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    const users = await FriendShipService.getMyFriends(userId)

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
    const { userId } = req.decoded
    const { keyword } = req.query

    if (!userId || !keyword) {
      _logger(req).error('Invalid query')

      res.status(400).json({
        isSuccess: false,
        errorCode: '400',
        message: 'Invalid query',
        data: null
      })
      return
    }
    const users = await FriendShipService.searchFriendByKeyword({
      userId,
      keyword: keyword as string
    })

    _logger(req).info('Search friend by keyword successful', {
      data: users
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Search friend by keyword successful',
      data: users
    })
  }

  unFriend = async (req: IRequest, res: Response) => {
    const { userId: senderId } = req.decoded
    const { friendId } = req.params
    await FriendShipService.unfriend({ senderId, friendId })
    await MessageService.deleteAllMessage(senderId, friendId)
    WsService.sendDataToClientById(friendId, {
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

export default new FriendShipController()
