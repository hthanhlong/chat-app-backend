import express from 'express'
import { FriendController } from '../controller'
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
  asyncHandler(FriendController.addFriend)
)
friendRouter.get(
  friendPaths.getFriendRequest,
  asyncHandler(FriendController.getFriendRequest)
)

friendRouter.post(
  friendPaths.updateFriendStatus,
  validatorInput(updateFriendStatusSchema),
  asyncHandler(FriendController.updateStatusFriend)
)
friendRouter.get(
  friendPaths.searchFriendByKeyword,
  asyncHandler(FriendController.searchFriendByKeyword)
)
friendRouter.get(friendPaths.unFriend, asyncHandler(FriendController.unFriend))
friendRouter.get(
  friendPaths.getFriends,
  asyncHandler(FriendController.getFriends)
)

export default friendRouter
