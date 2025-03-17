import { Response } from 'express'
import HttpException from '../../utils/httpExceptions'
import { MessageService } from '../services'
import { IRequest } from '../../types'
import logger from '../../utils/logger'

const _logger = logger('MessageController')

class MessageController {
  getAllMessages = async (req: IRequest, res: Response) => {
    const partnerId = req.query.partnerId as string
    if (!partnerId) {
      throw HttpException.badRequestError()
    }
    const userId = req.decoded.id
    const messages = await MessageService.getAllMessages(userId, partnerId)

    _logger(req).info('Get all messages successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all messages',
      data: messages
    })
  }

  getLatestMessage = async (req: IRequest, res: Response) => {
    const partnerId = req.query.partnerId as string
    if (!partnerId) {
      throw HttpException.badRequestError()
    }
    const userId = req.decoded.id
    const lastMessage = await MessageService.getLatestMessage(userId, partnerId)

    _logger(req).info('Get last message successful', {
      data: lastMessage
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get last message',
      data: lastMessage
    })
  }

  deleteAllMessage = async (req: IRequest, res: Response) => {
    const { senderId, receiverId } = req.body
    await MessageService.deleteAllMessage(senderId, receiverId)

    _logger(req).info('Delete all message successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Delete all message',
      data: null
    })
  }
}

export default new MessageController()
