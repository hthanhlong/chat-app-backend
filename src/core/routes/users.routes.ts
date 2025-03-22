import express from 'express'
import { UserController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken, validatorInput } from '../../middlewares'
import { userUpdateSchema } from '../../validation'

const userRouter = express.Router()

const userPaths = {
  getUsersNonFriends: '/non-friends',
  getUser: '/me',
  getUserById: '/:userId',
  updateUser: '/'
}

userRouter.use(asyncHandler(validateAccessToken))

userRouter.get(
  userPaths.getUsersNonFriends,
  asyncHandler(UserController.getUsersNonFriends)
)

userRouter.get(userPaths.getUser, asyncHandler(UserController.getUser))

userRouter.get(userPaths.getUserById, asyncHandler(UserController.getUserById))

userRouter.post(
  userPaths.updateUser,
  validatorInput(userUpdateSchema),
  asyncHandler(UserController.updateUser)
)

export default userRouter
