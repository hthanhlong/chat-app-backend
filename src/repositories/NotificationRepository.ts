import UserService from '../services/UserService';
import { NotificationModel } from '../database/model/Notification';
import User from '../database/model/User';
import WsService from '../services/WsService';

class NotificationRepository {
  async createNotification({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    const user = (await UserService.findUserById(senderId)) as User;

    const notification = {
      senderId,
      receiverId,
      type: 'FRIEND',
      content: `You have a new friend request from ${user.nickname}`,
      status: 'UNREAD',
    };
    await NotificationModel.create(notification);

    WsService.sendDataToId({
      receiverId: receiverId,
      data: {
        type: 'HAS_NEW_NOTIFICATION',
        payload: '',
      },
    });
  }

  async updateNotification({
    id,
    status,
  }: {
    id: string;
    status: 'READ' | 'UNREAD';
  }) {
    await NotificationModel.findByIdAndUpdate(id, { status });
  }

  async getAllNotificationsById(id: string) {
    const allNotifications = await NotificationModel.find({ receiverId: id });
    return allNotifications;
  }
}

export default new NotificationRepository();
