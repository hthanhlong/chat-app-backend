import { Response } from 'express'
import { IRequest } from '../../types'
import HttpException from '../../utils/httpExceptions'
import { UserService, FriendService } from '../services'
import logger from '../../utils/logger'

const _logger = logger('UserController')

class UserController {
  getMe = async (req: IRequest, res: Response) => {
    const userId = req.query.id as string
    if (!userId) {
      throw HttpException.badRequestError()
    }
    const user = await UserService.findUserById(userId)
    if (!user) {
      throw HttpException.badRequestError()
    }

    _logger(req).info('Get me successful', {
      data: user
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get me successful',
      data: user
    })
  }

  getUsers = async (req: IRequest, res: Response) => {
    const userId = req.query.id as string
    if (!userId) {
      throw HttpException.badRequestError()
    }
    const users = await FriendService.getAllUsersNonFriends(userId)

    _logger(req).info('Get users successful', {
      data: users
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get users successful',
      data: users
    })
  }

  updateUserById = async (req: IRequest, res: Response) => {
    const user = await UserService.updateUserById(req.params.id, req.body)
    if (!user) {
      throw HttpException.badRequestError()
    }

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
