import express from 'express'
import { FriendShipController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken, validatorInput } from '../../middlewares'
import { ValidationSchema } from '../../validation'
const friendRouter = express.Router()

const friendPaths = {
  getFriendRequest: '/friend-requests',
  searchFriendByKeyword: '/search-friend',
  addFriend: '/add-friend',
  updateFriendStatus: '/update-friend-status',
  unFriend: '/unfriend/:friendUuid',
  getFriends: '/'
}

friendRouter.use(asyncHandler(validateAccessToken))

friendRouter.post(
  friendPaths.addFriend,
  validatorInput(ValidationSchema.addFriend),
  asyncHandler(FriendShipController.addFriend)
)
friendRouter.get(
  friendPaths.getFriendRequest,
  asyncHandler(FriendShipController.getFriendRequest)
)

friendRouter.post(
  friendPaths.updateFriendStatus,
  validatorInput(ValidationSchema.updateFriendStatus),
  asyncHandler(FriendShipController.updateStatusFriend)
)
friendRouter.get(
  friendPaths.searchFriendByKeyword,
  asyncHandler(FriendShipController.searchFriendByKeyword)
)
friendRouter.get(
  friendPaths.unFriend,
  asyncHandler(FriendShipController.unFriend)
)
friendRouter.get(
  friendPaths.getFriends,
  asyncHandler(FriendShipController.getFriends)
)

export default friendRouter
