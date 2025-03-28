import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class NotificationRepository {
  async createNotification({
    userId,
    type,
    content,
    status
  }: {
    userId: number
    type: 'FRIEND' | 'MESSAGE' | 'POST'
    content: string
    status: 'READ' | 'UNREAD'
  }) {
    const notification = {
      userId: userId,
      type: type,
      content: content,
      status: status
    }
    await prisma.notification.create({
      data: notification
    })
  }

  async updateNotification({
    notificationUuid,
    status
  }: {
    notificationUuid: string
    status: 'READ' | 'UNREAD'
  }) {
    await prisma.notification.update({
      where: { uuid: notificationUuid },
      data: { status }
    })
  }

  async getAllNotificationsById(id: number) {
    const allNotifications = await prisma.notification.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        uuid: true,
        type: true,
        content: true,
        status: true,
        createdAt: true
      },
      take: 50
    })
    return allNotifications
  }
}

export default new NotificationRepository()
