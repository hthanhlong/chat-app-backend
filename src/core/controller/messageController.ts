import { Response } from 'express'
import { BadRequestError } from '../../utils/httpExceptions'
import { MessageService } from '../services'
import { IRequest } from '../../types'
class MessageController {
  getAllMessages = async (req: IRequest, res: Response) => {
    const partnerId = req.query.partnerId as string
    if (!partnerId) {
      throw new BadRequestError('Invalid partner Id')
    }
    const userId = req.decoded.id
    const messages = await MessageService.getAllMessages(userId, partnerId)

    console.log('messages', messages)
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
      throw new BadRequestError('Invalid partner Id')
    }
    const userId = req.decoded.id
    const lastMessage = await MessageService.getLatestMessage(userId, partnerId)
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
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Delete all message',
      data: null
    })
  }
}

export default new MessageController()
