import express from 'express';
import validator from '../helpers/validator';
import { loginSchema, sendFriendRequestSchema, signupSchema } from '../schema';
import {
  signupController,
  loginController,
} from '../controller/authController';
import asyncHandler from '../helpers/asyncHandler';
import { validateToken } from '../core/JWT';
import { getUsersOrGetOneUser } from '../controller/userController';
import {
  sendFriendRequest,
  getFriendRequest,
  getMyFriends,
  updateStatusFriend,
  searchFriendByKeyword,
} from '../controller/friendController';
import {
  getAllNotificationsById,
  updateNotification,
} from '../controller/notificationController';
const router = express.Router();

//router common
router.post('/signup', validator(signupSchema), asyncHandler(signupController));
router.post('/login', validator(loginSchema), asyncHandler(loginController));

//middlewares
router.use(validateToken('ACCESS'));

//router for authentication
router.get('/users/:id', asyncHandler(getUsersOrGetOneUser));
router.post(
  '/send-friend-request',
  validator(sendFriendRequestSchema),
  asyncHandler(sendFriendRequest),
);
router.get('/friend-requests/:id', asyncHandler(getFriendRequest));
router.get('/get-friends/:id', asyncHandler(getMyFriends));
router.post('/update-status-friend', asyncHandler(updateStatusFriend));
router.get('/search-friend/:id', asyncHandler(searchFriendByKeyword));
router.patch('/notifications', asyncHandler(updateNotification));
router.get('/notifications/:id', asyncHandler(getAllNotificationsById));

export default router;
