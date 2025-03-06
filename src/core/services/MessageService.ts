import { MessageRepository } from '../repositories'
class MessageService {
  async getAllMessages(userId: string, partnerId: string) {
    return await MessageRepository.getAllMessages(userId, partnerId)
  }

  async createMessage({
    senderId,
    receiverId,
    message,
    createdAt
  }: {
    senderId: string
    receiverId: string
    message: string
    createdAt: Date
  }) {
    return await MessageRepository.createMessage({
      senderId,
      receiverId,
      message,
      createdAt
    })
  }

  async getLastMessage(userId: string, partnerId: string) {
    return await MessageRepository.getLastMessage(userId, partnerId)
  }

  async deleteAllMessage(senderId: string, receiverId: string) {
    return await MessageRepository.deleteAllMessage(senderId, receiverId)
  }
}

export default new MessageService()
