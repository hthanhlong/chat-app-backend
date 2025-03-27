import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class MessageRepository {
  async getAllMessages(
    userId: number,
    friendId: number,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const totalCount = await prisma.message.count({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
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
    const result = await prisma.message.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        message,
        createdAt
      }
    })
    return result
  }

  async getLatestMessage(userId: number, friendId: number) {
    return await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    })
  }

  async deleteAllMessage(senderId: number, receiverId: number) {
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    })
  }
}

export default new MessageRepository()
