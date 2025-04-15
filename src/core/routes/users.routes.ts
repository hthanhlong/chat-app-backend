import express from 'express'
import { UserController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken, validatorInput } from '../../middlewares'
import { ValidationSchema } from '../../validation'
import { UtilsService } from '../../core/services'

const userRouter = express.Router()

const userPaths = {
  getUsersNonFriends: '/non-friends',
  getUser: '/me',
  getUserByUuid: '/:userUuid',
  updateUser: '/'
}

userRouter.use(asyncHandler(validateAccessToken))

userRouter.get(
  userPaths.getUsersNonFriends,
  asyncHandler(UserController.getUsersNonFriends)
)

userRouter.get(userPaths.getUser, asyncHandler(UserController.getUser))

userRouter.get(
  userPaths.getUserByUuid,
  asyncHandler(UserController.getUserByUuid)
)

userRouter.post(
  userPaths.updateUser,
  validatorInput(ValidationSchema.userUpdate),
  UtilsService.getMulter().single('file'),
  asyncHandler(UserController.updateUser)
)

export default userRouter
