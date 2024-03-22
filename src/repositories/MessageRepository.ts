import { MessageModel } from '../database/model/Message';

class MessageRepository {
  async getAllMessages(userId: string, partner_id: string) {
    const result = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: partner_id },
        { senderId: partner_id, receiverId: partner_id },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);
    return result;
  }
}

export default new MessageRepository();
