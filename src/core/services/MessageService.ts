import { MessageRepository } from '../repositories'
class MessageService {
  async getAllMessages(userId: number, friendId: number, page: number = 1) {
    return await MessageRepository.getAllMessages(userId, friendId, page)
  }

  async createMessage({
    senderId,
    receiverId,
    message,
    createdAt
  }: {
    senderId: number
    receiverId: number
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

  async getLatestMessage(userId: number, friendId: number) {
    return await MessageRepository.getLatestMessage(userId, friendId)
  }

  async deleteAllMessage(senderId: number, receiverId: number) {
    return await MessageRepository.deleteAllMessage(senderId, receiverId)
  }
}

export default new MessageService()
