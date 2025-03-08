import { Response } from 'express'
import { IRequest } from '../../types'
import { BadRequestError } from '../../utils/httpExceptions'
import { UserService, FriendService } from '../services'
class UserController {
  getUsersOrGetOneUser = async (req: IRequest, res: Response) => {
    if (
      !req.query.type ||
      ['all', 'one'].indexOf(req.query.type as string) === -1
    ) {
      throw new BadRequestError('Invalid type')
    }

    let users = null
    let message = null
    const userId = req.query.id as string
    if (!userId) {
      throw new BadRequestError('Invalid id')
    }

    if (req.query.type === 'all') {
      users = await FriendService.getAllUsersNonFriends(userId)

      message = 'Get all users'
    }

    if (req.query.type === 'one') {
      users = await UserService.findUserById(userId)
      message = 'Get a user'
    }

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: message,
      data: users
    })
  }

  updateUserById = async (req: IRequest, res: Response) => {
    const user = await UserService.updateUserById(req.params.id, req.body)
    if (!user) {
      throw new BadRequestError('Update user failed')
    }
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Update user successful',
      data: user
    })
  }
}

export default new UserController()
