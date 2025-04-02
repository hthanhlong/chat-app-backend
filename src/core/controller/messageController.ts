import { Response, Request } from 'express'
import HttpException from '../../exceptions/httpExceptions'
import { MessageService } from '../services'
import LoggerService from '../services/LoggerService'
class MessageController {
  getMessages = async (req: Request, res: Response) => {
    const { uuid: senderUuid } = req.decoded as JWT_PAYLOAD
    const { friendUuid } = req.params
    const { page } = req.query

    const messages = await MessageService.getAllMessages(
      senderUuid,
      friendUuid,
      page ? Number(page) : 1
    )

    LoggerService.info({
      where: 'MessageController',
      message: 'Get all messages successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get all messages',
      data: messages
    })
  }

  getLatestMessage = async (req: Request, res: Response) => {
    const { uuid: senderUuid } = req.decoded as JWT_PAYLOAD
    const { friendUuid } = req.params
    if (!friendUuid) throw HttpException.badRequestError()

    const lastMessage = await MessageService.getLatestMessage(
      senderUuid,
      friendUuid
    )

    LoggerService.info({
      where: 'MessageController',
      message: 'Get last message successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Get last message',
      data: lastMessage
    })
  }

  deleteAllMessage = async (req: Request, res: Response) => {
    const { uuid: senderUuid } = req.decoded as JWT_PAYLOAD
    const { friendUuid } = req.params
    await MessageService.deleteAllMessage(senderUuid, friendUuid)

    LoggerService.info({
      where: 'MessageController',
      message: 'Delete all message successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Delete all message',
      data: null
    })
  }
}

export default new MessageController()
