import { Response } from 'express'
import HttpException from '../../utils/httpExceptions'
import { MessageService } from '../services'
import { IRequest } from '../../types'
import logger from '../../utils/logger'

const _logger = logger('MessageController')

class MessageController {
  getMessages = async (req: IRequest, res: Response) => {
    const { userId: senderId } = req.decoded
    const { friendId } = req.params
    const { page } = req.query
    if (!friendId) {
      throw HttpException.badRequestError()
    }
    const messages = await MessageService.getAllMessages(
      senderId,
      friendId,
      page ? Number(page) : 1
    )

    _logger(req).info('Get all messages successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all messages',
      data: messages
    })
  }

  getLatestMessage = async (req: IRequest, res: Response) => {
    const { userId: senderId } = req.decoded
    const { friendId } = req.params
    if (!friendId) throw HttpException.badRequestError()

    const lastMessage = await MessageService.getLatestMessage(
      senderId,
      friendId
    )

    _logger(req).info('Get last message successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get last message',
      data: lastMessage
    })
  }

  deleteAllMessage = async (req: IRequest, res: Response) => {
    const { userId: senderId } = req.decoded
    const { friendId } = req.body
    await MessageService.deleteAllMessage(senderId, friendId)

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
