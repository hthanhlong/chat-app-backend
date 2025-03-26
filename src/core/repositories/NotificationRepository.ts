import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class NotificationRepository {
  async createNotification({
    senderId,
    receiverId,
    type,
    content,
    status
  }: {
    senderId: number
    receiverId: number
    type: 'FRIEND' | 'MESSAGE' | 'POST'
    content: string
    status: 'READ' | 'UNREAD'
  }) {
    const notification = {
      senderId: senderId,
      receiverId: receiverId,
      type: type,
      content: content,
      status: status
    }
    await prisma.notification.create({
      data: notification
    })
  }

  async updateNotification({
    id,
    status
  }: {
    id: number
    status: 'READ' | 'UNREAD'
  }) {
    await prisma.notification.update({
      where: { id: id },
      data: { status }
    })
  }

  async getAllNotificationsById(id: number) {
    const allNotifications = await prisma.notification.findMany({
      where: { receiverId: id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return allNotifications
  }
}

export default new NotificationRepository()
