import { Response } from 'express'
import { IRequest } from '../../types'
import HttpException from '../../utils/httpExceptions'
import { UserService, FriendShipService } from '../services'
import LoggerService from '../services/LoggerService'

class UserController {
  getUser = async (req: IRequest, res: Response) => {
    const { id: userId } = req.decoded
    const user = await UserService.findUserById(userId)

    LoggerService.info({
      where: 'UserController',
      message: 'Get user successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get user successful',
      data: user
    })
  }

  getUserById = async (req: IRequest, res: Response) => {
    const userId = req.params.userId
    if (!userId) throw HttpException.badRequestError()
    const user = await UserService.findUserById(userId)
    if (!user) {
      res.status(200).json({
        isSuccess: true,
        errorCode: null,
        message: 'No user found',
        data: null
      })
      return
    }

    LoggerService.info({
      where: 'UserController',
      message: 'Get user by id successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get user by id successful',
      data: user
    })
  }

  getUsersNonFriends = async (req: IRequest, res: Response) => {
    const { id: userId } = req.decoded
    if (!userId) throw HttpException.badRequestError()
    const users = await FriendShipService.getAllUsersNonFriends(userId)

    LoggerService.info({
      where: 'UserController',
      message: 'Get users non friends successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get users non friends successful',
      data: users
    })
  }

  updateUser = async (req: IRequest, res: Response) => {
    const { id: userId } = req.decoded
    if (!userId) throw HttpException.badRequestError()
    const user = await UserService.updateUserById(userId, req.body)

    LoggerService.info({
      where: 'UserController',
      message: 'Update user successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Update user successful',
      data: user
    })
  }
}

export default new UserController()
