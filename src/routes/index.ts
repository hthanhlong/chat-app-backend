import express from 'express'
import validator from '../validation'
import {
  googleLoginSchema,
  loginSchema,
  sendFriendRequestSchema,
  signupSchema,
  userUpdateSchema
} from '../validation/schema'
import {
  signupController,
  loginController,
  refreshTokenController,
  googleLoginController
} from '../core/controller/authController'
import asyncHandler from '../helpers/asyncHandler'
import { validateAccessToken, validateRefreshToken } from '../utils'
import {
  getUsersOrGetOneUser,
  updateUserById
} from '../core/controller/userController'
import {
  sendFriendRequest,
  getFriendRequest,
  getMyFriends,
  updateStatusFriend,
  searchFriendByKeyword,
  unfriend
} from '../core/controller/friendController'
import {
  getAllNotificationsById,
  updateNotification
} from '../core/controller/notificationController'
import {
  getAllMessages,
  getLastMessage,
  deleteAllMessage
} from '../core/controller/messageController'
const router = express.Router()

//router common
router.post('/signup', validator(signupSchema), asyncHandler(signupController))
router.post('/login', validator(loginSchema), asyncHandler(loginController))
router.post(
  '/refresh-token',
  validateRefreshToken,
  asyncHandler(refreshTokenController)
)
router.post(
  '/auth/google',
  validator(googleLoginSchema),
  asyncHandler(googleLoginController)
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
router.post('/unfriend', asyncHandler(unfriend))
router.post('/delete-all-message', asyncHandler(deleteAllMessage))

export default router
