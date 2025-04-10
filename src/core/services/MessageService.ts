import { AwsService } from '.'
import { UtilsService } from '.'
import { MessageRepository } from '../repositories'
import kafkaService from './kafkaService'

class MessageService {
  async getAllMessages(userUuid: string, friendUuid: string, page: number = 1) {
    return await MessageRepository.getAllMessages(userUuid, friendUuid, page)
  }

  async createMessage({
    uuid,
    senderUuid,
    receiverUuid,
    message,
    file
  }: {
    uuid: string
    senderUuid: string
    receiverUuid: string
    message: string
    file?: string
  }) {
    return await MessageRepository.createMessage({
      uuid,
      senderUuid,
      receiverUuid,
      message,
      file
    })
  }

  async getLatestMessage(userUuid: string, friendUuid: string) {
    return await MessageRepository.getLatestMessage(userUuid, friendUuid)
  }

  async deleteAllMessage(senderUuid: string, receiverUuid: string) {
    return await MessageRepository.deleteAllMessage(senderUuid, receiverUuid)
  }

  async uploadFile(message: {
    senderUuid: string
    receiverUuid: string
    message: string
    uuid: string
    file: Express.Multer.File
  }) {
    const compressedFile = await UtilsService.compressImage(message.file)
    const fileUrl = await AwsService.uploadFile({
      originalname: message.file.originalname,
      buffer: Buffer.from(compressedFile),
      mimetype: message.file.mimetype
    })
    const savedMessage = await MessageRepository.createMessage({
      senderUuid: message.senderUuid,
      receiverUuid: message.receiverUuid,
      message: message.message,
      uuid: message.uuid,
      file: fileUrl
    })

    await kafkaService.produceMessageToTopic('MESSAGE_TOPIC', {
      key: 'NEW_MESSAGE',
      value: {
        uuid: savedMessage.receiverUuid,
        requestId: null,
        eventName: 'NEW_MESSAGE_HAS_IMAGE',
        sendByProducer: 'API_SERVER',
        data: savedMessage
      }
    })

    return savedMessage
  }
}

export default new MessageService()
