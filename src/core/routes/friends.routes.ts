import express from 'express'
import { FriendShipController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken, validatorInput } from '../../middlewares'
import { addFriendSchema, updateFriendStatusSchema } from '../../validation'
const friendRouter = express.Router()

const friendPaths = {
  getFriendRequest: '/friend-requests',
  searchFriendByKeyword: '/search-friend',
  addFriend: '/add-friend',
  updateFriendStatus: '/update-friend-status',
  unFriend: '/unfriend/:friendId',
  getFriends: '/'
}

friendRouter.use(validateAccessToken)

friendRouter.post(
  friendPaths.addFriend,
  validatorInput(addFriendSchema),
  asyncHandler(FriendShipController.addFriend)
)
friendRouter.get(
  friendPaths.getFriendRequest,
  asyncHandler(FriendShipController.getFriendRequest)
)

friendRouter.post(
  friendPaths.updateFriendStatus,
  validatorInput(updateFriendStatusSchema),
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
