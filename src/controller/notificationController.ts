import { Request, Response } from 'express'
import NotificationService from '../services/NotificationService'

export const getAllNotificationsById = async (req: Request, res: Response) => {
  const notifications = await NotificationService.getAllNotificationsById(
    req.params.id
  )
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all notifications',
    data: notifications
  })
}

export const updateNotification = async (req: Request, res: Response) => {
  const { id, status } = req.body
  await NotificationService.updateNotification({ id, status })
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Notification updated',
    data: null
  })
}
