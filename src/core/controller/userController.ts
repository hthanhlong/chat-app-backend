import { Response } from 'express'
import { IRequest } from '../../types'
import HttpException from '../../utils/httpExceptions'
import { UserService, FriendService } from '../services'
import logger from '../../utils/logger'

const _logger = logger('UserController')

class UserController {
  getUser = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    const user = await UserService.findUserById(userId)

    _logger(req).info('Get user successful', {
      data: user
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

    _logger(req).info('Get user by id successful', {
      data: user
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get user by id successful',
      data: user
    })
  }

  getUsersNonFriends = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    console.log('userId', userId)
    if (!userId) throw HttpException.badRequestError()
    const users = await FriendService.getAllUsersNonFriends(userId)

    _logger(req).info('Get users non friends successful', {
      data: users
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get users non friends successful',
      data: users
    })
  }

  updateUser = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    if (!userId) throw HttpException.badRequestError()
    const user = await UserService.updateUserById(userId, req.body)

    _logger(req).info('Update user successful', {
      data: user
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
