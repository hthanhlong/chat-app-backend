import { Request, Response } from 'express'
import { BadRequestError } from '../../utils/httpExceptions'
import { FriendService, UserService } from '../services'

export const getUsersOrGetOneUser = async (req: Request, res: Response) => {
  if (
    !req.query.type ||
    ['all', 'one'].indexOf(req.query.type as string) === -1
  ) {
    throw new BadRequestError('Invalid type')
  }

  let users = null
  let message = null

  if (req.query.type === 'all') {
    users = await FriendService.getAllUsersNonFriends(req.params.id)

    message = 'Get all users'
  }

  if (req.query.type === 'one') {
    users = await UserService.findUserById(req.params.id)
    message = 'Get a user'
  }

  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: message,
    data: users
  })
}

export const updateUserById = async (req: Request, res: Response) => {
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
