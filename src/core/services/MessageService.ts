import { MessageRepository } from '../repositories'
import Utils from './UtilsService'
import HttpException from '../../exceptions/httpExceptions'

class MessageService {
  async getAllMessages(userId: number, friendUuid: string, page: number = 1) {
    const friendId = await Utils.getUserIdFromUserUuid(friendUuid)
    if (!friendId) throw HttpException.badRequestError()
    return await MessageRepository.getAllMessages(userId, friendId, page)
  }

  async createMessage({
    senderId,
    receiverUuid,
    message,
    createdAt
  }: {
    senderId: number
    receiverUuid: string
    message: string
    createdAt: Date
  }) {
    const receiverId = await Utils.getUserIdFromUserUuid(receiverUuid)
    if (!receiverId) throw HttpException.badRequestError()
    return await MessageRepository.createMessage({
      senderId,
      receiverId,
      message,
      createdAt
    })
  }

  async getLatestMessage(userId: number, friendUuid: string) {
    const friendId = await Utils.getUserIdFromUserUuid(friendUuid)
    if (!friendId) throw HttpException.badRequestError()
    return await MessageRepository.getLatestMessage(userId, friendId)
  }

  async deleteAllMessage(senderId: number, receiverUuid: string) {
    const receiverId = await Utils.getUserIdFromUserUuid(receiverUuid)
    if (!receiverId) throw HttpException.badRequestError()
    return await MessageRepository.deleteAllMessage(senderId, receiverId)
  }
}

export default new MessageService()
