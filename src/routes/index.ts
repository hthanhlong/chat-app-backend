import express from 'express'
import validator from '../helpers/validator'
import {
  loginSchema,
  sendFriendRequestSchema,
  signupSchema,
  userUpdateSchema
} from '../schema'
import {
  signupController,
  loginController,
  refreshTokenController
} from '../controller/authController'
import asyncHandler from '../helpers/asyncHandler'
import { validateAccessToken, validateRefreshToken } from '../core/JWT'
import {
  getUsersOrGetOneUser,
  updateUserById
} from '../controller/userController'
import {
  sendFriendRequest,
  getFriendRequest,
  getMyFriends,
  updateStatusFriend,
  searchFriendByKeyword
} from '../controller/friendController'
import {
  getAllNotificationsById,
  updateNotification
} from '../controller/notificationController'
import { getAllMessages, getLastMessage } from '../controller/messageController'
const router = express.Router()

//router common
router.post('/signup', validator(signupSchema), asyncHandler(signupController))
router.post('/login', validator(loginSchema), asyncHandler(loginController))
router.post(
  '/refresh-token',
  validateRefreshToken,
  asyncHandler(refreshTokenController)
)

//middlewares
router.use(validateAccessToken)

//router for authentication
router.get('/users/:id', asyncHandler(getUsersOrGetOneUser))
router.put(
  '/users/:id',
  validator(userUpdateSchema),
  asyncHandler(updateUserById)
)
router.post(
  '/send-friend-request',
  validator(sendFriendRequestSchema),
  asyncHandler(sendFriendRequest)
)
router.get('/friend-requests/:id', asyncHandler(getFriendRequest))
router.get('/get-friends/:id', asyncHandler(getMyFriends))
router.post('/update-status-friend', asyncHandler(updateStatusFriend))
router.get('/search-friend/:id', asyncHandler(searchFriendByKeyword))
router.patch('/notifications', asyncHandler(updateNotification))
router.get('/notifications/:id', asyncHandler(getAllNotificationsById))
router.get('/get-messages/:partner_id', asyncHandler(getAllMessages))
router.get('/get-last-message/:partner_id', asyncHandler(getLastMessage))

export default router
