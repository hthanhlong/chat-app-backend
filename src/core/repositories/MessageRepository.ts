import { MessageModel } from '../../database/model'

class MessageRepository {
  async getAllMessages(
    userId: string,
    friendId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit

    const messages = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalCount = await MessageModel.countDocuments({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId }
      ]
    })

    return {
      messages: messages.reverse(),
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
    senderId: string
    receiverId: string
    message: string
    createdAt: Date
  }) {
    await MessageModel.create({
      senderId,
      receiverId,
      message,
      createdAt
    })
  }

  async getLatestMessage(userId: string, friendId: string) {
    return await MessageModel.findOne({
      senderId: { $in: [userId, friendId] },
      receiverId: { $in: [userId, friendId] }
    })
      .sort({ createdAt: -1 })
      .limit(1)
  }

  async deleteAllMessage(senderId: string, receiverId: string) {
    await MessageModel.deleteMany({
      senderId: { $in: [senderId, receiverId] },
      receiverId: { $in: [senderId, receiverId] }
    })
  }
}

export default new MessageRepository()
