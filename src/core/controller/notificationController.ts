import { Response } from 'express'
import { IRequest } from '../../types'
import { NotificationService } from '../services'
import logger from '../../utils/logger'

const _logger = logger('NotificationController')

class NotificationController {
  getAllNotificationsById = async (req: IRequest, res: Response) => {
    const notifications = await NotificationService.getAllNotificationsById(
      req.params.id
    )

    _logger(req).info('Get all notifications successful', {
      data: notifications
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all notifications',
      data: notifications
    })
  }

  updateNotification = async (req: IRequest, res: Response) => {
    const { id, status } = req.body
    await NotificationService.updateNotification({ id, status })

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
