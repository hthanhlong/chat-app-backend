import express from 'express'
import {
  googleSignInSchema,
  signInSchema,
  sendFriendRequestSchema,
  userUpdateSchema,
  signUpSchema
} from '../validation'
import {
  AuthController,
  FriendController,
  MessageController,
  NotificationController,
  UserController
} from '../core/controller'
import {
  validateAccessToken,
  validateRefreshToken,
  validatorInput
} from '../core/middlewares'
import { asyncHandler } from '../helpers'

const router = express.Router()

//router common
router.post(
  '/sign-up',
  validatorInput(signUpSchema),
  asyncHandler(AuthController.signUp)
)
router.post(
  '/sign-in',
  validatorInput(signInSchema),
  asyncHandler(AuthController.signIn)
)
router.post(
  '/refresh-token',
  asyncHandler(validateRefreshToken),
  asyncHandler(AuthController.refreshToken)
)
router.post(
  '/auth/google',
  validatorInput(googleSignInSchema),
  asyncHandler(AuthController.googleSignIn)
)

//middlewares
router.use(asyncHandler(validateAccessToken))

router.get('/users', asyncHandler(UserController.getUsers))
router.get('/me', asyncHandler(UserController.getMe))
router.put(
  '/users/:id',
  validatorInput(userUpdateSchema),
  asyncHandler(UserController.updateUserById)
)
router.post(
  '/send-friend-request',
  validatorInput(sendFriendRequestSchema),
  asyncHandler(FriendController.sendFriendRequest)
)
router.get(
  '/friend-requests/:id',
  asyncHandler(FriendController.getFriendRequest)
)
router.get('/get-friends', asyncHandler(FriendController.getMyFriends))
router.post(
  '/update-status-friend',
  asyncHandler(FriendController.updateStatusFriend)
)
router.get(
  '/search-friend/:id',
  asyncHandler(FriendController.searchFriendByKeyword)
)
router.post('/unfriend', asyncHandler(FriendController.unFriend))
router.patch(
  '/notifications',
  asyncHandler(NotificationController.updateNotification)
)
router.get(
  '/notifications/:id',
  asyncHandler(NotificationController.getAllNotificationsById)
)
router.get('/get-messages', asyncHandler(MessageController.getAllMessages))
router.get(
  '/get-latest-message',
  asyncHandler(MessageController.getLatestMessage)
)
router.post(
  '/delete-all-message',
  asyncHandler(MessageController.deleteAllMessage)
)

export default router
