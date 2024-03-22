import MessageRepository from '../repositories/MessageRepository';

class MessageService {
  getAllMessages(userId: string, partnerId: string) {
    return MessageRepository.getAllMessages(userId, partnerId);
  }
}

export default new MessageService();
