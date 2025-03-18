import { MessageRepository } from '../repositories'
class MessageService {
  async getAllMessages(userId: string, friendId: string) {
    return await MessageRepository.getAllMessages(userId, friendId)
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

  async getLatestMessage(userId: string, friendId: string) {
    return await MessageRepository.getLatestMessage(userId, friendId)
  }

  async deleteAllMessage(senderId: string, receiverId: string) {
    return await MessageRepository.deleteAllMessage(senderId, receiverId)
  }
}

export default new MessageService()
