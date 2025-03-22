import express from 'express'
import { NotificationController } from '../controller'
import { asyncHandler } from '../../helpers'
import { validateAccessToken } from '../../middlewares'
const notificationRouter = express.Router()

const notificationPaths = {
  updateNotification: '/',
  getNotifications: '/'
}

notificationRouter.use(asyncHandler(validateAccessToken))

notificationRouter.post(
  notificationPaths.updateNotification,
  asyncHandler(NotificationController.updateNotification)
)
notificationRouter.get(
  notificationPaths.getNotifications,
  asyncHandler(NotificationController.getNotifications)
)

export default notificationRouter
