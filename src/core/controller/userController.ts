import { Response, Request } from 'express'
import HttpException from '../../exceptions/httpExceptions'
import { UserService, FriendShipService } from '../services'
import LoggerService from '../services/LoggerService'

class UserController {
  getUser = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
    const user = await UserService.findUserById(userId)

    LoggerService.info({
      where: 'UserController',
      message: 'Get user successful'
    })

    // remove id from user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = user

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get user successful',
      data: rest
    })
  }

  getUserByUuid = async (req: Request, res: Response) => {
    const userUuid = req.params.userUuid
    if (!userUuid) throw HttpException.badRequestError()
    const user = await UserService.findUserByUuid(userUuid)
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

    // remove id from user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = user

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get user by id successful',
      data: rest
    })
  }

  getUsersNonFriends = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
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

  updateUser = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
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
