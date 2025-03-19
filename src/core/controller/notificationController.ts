import { Response } from 'express'
import { IRequest } from '../../types'
import { NotificationService } from '../services'
import logger from '../../utils/logger'

const _logger = logger('NotificationController')

class NotificationController {
  getNotifications = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded

    const notifications =
      await NotificationService.getAllNotificationsById(userId)

    _logger(req).info('Get all notifications successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all notifications',
      data: notifications
    })
  }

  updateNotification = async (req: IRequest, res: Response) => {
    const { notificationId, status } = req.body
    await NotificationService.updateNotification({ id: notificationId, status })

    _logger(req).info('Update notification successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Notification updated',
      data: null
    })
  }
}

export default new NotificationController()
