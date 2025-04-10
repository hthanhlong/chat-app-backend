import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class MessageRepository {
  async getAllMessages(
    userUuid: string,
    friendUuid: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderUuid: userUuid, receiverUuid: friendUuid },
          { senderUuid: friendUuid, receiverUuid: userUuid }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const totalCount = await prisma.message.count({
      where: {
        OR: [
          { senderUuid: userUuid, receiverUuid: friendUuid },
          { senderUuid: friendUuid, receiverUuid: userUuid }
        ]
      }
    })

    return {
      messages: messages.length > 0 ? messages.reverse() : [],
      hasMore: skip + messages.length < totalCount,
      currentPage: page
    }
  }

  async createMessage({
    senderUuid,
    receiverUuid,
    message,
    uuid,
    file
  }: {
    senderUuid: string
    receiverUuid: string
    message: string
    uuid: string
    file?: string
  }) {
    const result = await prisma.message.create({
      data: {
        uuid,
        senderUuid: senderUuid,
        receiverUuid: receiverUuid,
        message,
        file: file ? file : null
      }
    })
    return result
  }

  async getLatestMessage(userUuid: string, friendUuid: string) {
    return await prisma.message.findFirst({
      where: {
        OR: [
          { senderUuid: userUuid, receiverUuid: friendUuid },
          { senderUuid: friendUuid, receiverUuid: userUuid }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    })
  }

  async deleteAllMessage(senderUuid: string, receiverUuid: string) {
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderUuid: senderUuid, receiverUuid: receiverUuid },
          { senderUuid: receiverUuid, receiverUuid: senderUuid }
        ]
      }
    })
  }
}

export default new MessageRepository()
