import { Response, Request } from 'express'
import { WsService, FriendShipService, MessageService } from '../services'
import LoggerService from '../services/LoggerService'

class FriendShipController {
  addFriend = async (req: Request, res: Response) => {
    const {
      id: senderId,
      nickName: senderNickName,
      uuid: senderUuid
    } = req.decoded as JWT_PAYLOAD
    const { receiverUuid, status } = req.body
    await FriendShipService.addFriend({
      senderId,
      senderNickName,
      senderUuid,
      receiverUuid,
      status
    })

    LoggerService.info({
      where: 'FriendShipController',
      message: 'Send friend request successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Friend request sent',
      data: null
    })
  }

  getFriendRequest = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
    const users = await FriendShipService.getFriendRequest(userId)

    LoggerService.info({
      where: 'FriendShipController',
      message: 'Get friend request successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get friend request successful',
      data: users
    })
  }

  updateStatusFriend = async (req: Request, res: Response) => {
    const {
      id: senderId,
      nickName: senderNickName,
      uuid: senderUuid
    } = req.decoded as JWT_PAYLOAD
    const { receiverUuid, status } = req.body

    const result = await FriendShipService.updateStatusFriend({
      senderId,
      senderUuid,
      senderNickName,
      receiverUuid,
      status
    })

    if (!result) {
      LoggerService.error({
        where: 'FriendShipController',
        message: 'Update status friend failed'
      })
      res.status(400).json({
        isSuccess: false,
        errorCode: '400',
        message: 'Update status friend failed',
        data: null
      })
    }

    LoggerService.info({
      where: 'FriendShipController',
      message: 'Update status friend successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'update status friend successfully',
      data: null
    })
  }

  getAllUsersNonFriends = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
    const users = await FriendShipService.getAllUsersNonFriends(userId)
    LoggerService.info({
      where: 'FriendShipController',
      message: 'Get all users non friends successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  getFriends = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
    const users = await FriendShipService.getMyFriendsById(userId)

    LoggerService.info({
      where: 'FriendShipController',
      message: `Get my friends: ${userId} successful`
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all users',
      data: users
    })
  }

  searchFriendByKeyword = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
    const { keyword } = req.query

    if (!userId || !keyword) {
      LoggerService.error({
        where: 'FriendShipController',
        message: 'Invalid query'
      })

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

    LoggerService.info({
      where: 'FriendShipController',
      message: 'Search friend by keyword successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Search friend by keyword successful',
      data: users
    })
  }

  unFriend = async (req: Request, res: Response) => {
    const { id: senderId, uuid: senderUuid } = req.decoded as JWT_PAYLOAD
    const { friendUuid } = req.params
    await FriendShipService.unfriend({ senderId, friendUuid })
    await MessageService.deleteAllMessage(senderUuid, friendUuid)
    WsService.sendDataToClientByUuid(senderUuid, {
      type: 'UPDATE_FRIEND_LIST',
      payload: null
    })

    LoggerService.info({
      where: 'FriendShipController',
      message: 'Unfriend successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Unfriend successfully',
      data: null
    })
  }
}

export default new FriendShipController()
