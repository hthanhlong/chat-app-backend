import MessageRepository from '../repositories/MessageRepository';

class MessageService {
  async getAllMessages(userId: string, partnerId: string) {
    return await MessageRepository.getAllMessages(userId, partnerId);
  }

  async createMessage({
    senderId,
    receiverId,
    message,
  }: {
    senderId: string;
    receiverId: string;
    message: string;
  }) {
    return await MessageRepository.createMessage({
      senderId,
      receiverId,
      message,
    });
  }
}

export default new MessageService();
