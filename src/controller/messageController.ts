import { Request, Response } from 'express'
import MessageService from '../services/MessageService'

interface CustomRequest extends Request {
  decoded: {
    id: string
  }
}

export const getAllMessages = async (req: CustomRequest, res: Response) => {
  const { partner_id } = req.params
  const messages = await MessageService.getAllMessages(
    req.decoded.id,
    partner_id
  )
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get all messages',
    data: messages
  })
}

export const getLastMessage = async (req: CustomRequest, res: Response) => {
  const { partner_id } = req.params
  const lastMessage = await MessageService.getLastMessage(
    req.decoded.id,
    partner_id
  )
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'Get last message',
    data: lastMessage
  })
}
