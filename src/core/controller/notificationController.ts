import { Response } from 'express'
import { IRequest } from '../../types'
import { NotificationService } from '../services'
import LoggerService from '../services/LoggerService'

class NotificationController {
  getNotifications = async (req: IRequest, res: Response) => {
    const { id: userId } = req.decoded

    const notifications =
      await NotificationService.getAllNotificationsById(userId)

    LoggerService.info({
      where: 'NotificationController',
      message: 'Get all notifications successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all notifications',
      data: notifications
    })
  }

  updateNotification = async (req: IRequest, res: Response) => {
    const { id: userId } = req.decoded
    const { notificationUuid, status } = req.body
    await NotificationService.updateNotification({
      userId,
      notificationUuid,
      status
    })

    LoggerService.info({
      where: 'NotificationController',
      message: 'Update notification successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Notification updated',
      data: null
    })
  }
}

export default new NotificationController()
