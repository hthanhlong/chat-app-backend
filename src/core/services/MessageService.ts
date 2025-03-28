import { MessageRepository } from '../repositories'

class MessageService {
  async getAllMessages(userUuid: string, friendUuid: string, page: number = 1) {
    return await MessageRepository.getAllMessages(userUuid, friendUuid, page)
  }

  async createMessage({
    senderUuid,
    receiverUuid,
    message,
    createdAt
  }: {
    senderUuid: string
    receiverUuid: string
    message: string
    createdAt: Date
  }) {
    return await MessageRepository.createMessage({
      senderUuid,
      receiverUuid,
      message,
      createdAt
    })
  }

  async getLatestMessage(userUuid: string, friendUuid: string) {
    return await MessageRepository.getLatestMessage(userUuid, friendUuid)
  }

  async deleteAllMessage(senderUuid: string, receiverUuid: string) {
    return await MessageRepository.deleteAllMessage(senderUuid, receiverUuid)
  }
}

export default new MessageService()
