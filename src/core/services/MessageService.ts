import { MessageRepository } from '../repositories'

class MessageService {
  async getAllMessages(userUuid: string, friendUuid: string, page: number = 1) {
    return await MessageRepository.getAllMessages(userUuid, friendUuid, page)
  }

  async createMessage({
    uuid,
    senderUuid,
    receiverUuid,
    message
  }: {
    uuid: string
    senderUuid: string
    receiverUuid: string
    message: string
  }) {
    return await MessageRepository.createMessage({
      uuid,
      senderUuid,
      receiverUuid,
      message
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
