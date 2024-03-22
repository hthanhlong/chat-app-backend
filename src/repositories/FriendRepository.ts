import { dataSelectedByKeys } from './../database/utils';
import { FriendShipModel } from './../database/model/FriendShip';
import UserService from '../services/UserService';
import User, { UserModel } from '../database/model/User';
import { filterFriendsById } from './helper';
import NotificationService from '../services/NotificationService';

class FriendRepository {
  async SendFriendRequest(data: {
    senderId: string;
    receiverId: string;
    status: string;
  }) {
    await FriendShipModel.create({
      senderId: data.senderId,
      receiveId: data.receiverId,
      status: data.status,
    });

    await NotificationService.createNotification({
      senderId: data.senderId,
      receiverId: data.receiverId,
    });
  }

  async GetAllUsersNonFriends(id: string) {
    const friendListIds = await FriendShipModel.find({
      $or: [{ senderId: id }, { receiveId: id }],
    });

    const friendIds = friendListIds.map(function (user) {
      if (user.senderId.toString() === id.toString()) {
        return user.receiveId;
      }
      if (user.receiveId.toString() === id.toString()) {
        return user.senderId;
      }
    });

    let nonFriends = await UserService.getAllUsers(id);
    if (Array.isArray(friendListIds) && friendListIds.length > 0) {
      if (!nonFriends) return [];
      nonFriends = nonFriends.filter((user: User) => {
        return !friendIds.some(
          // @ts-ignore
          (id) => id.toString() === user._id.toString(),
        );
      });
      return nonFriends;
    }
    return nonFriends;
  }

  async GetFriendRequests(id: string) {
    const friendListIds = await FriendShipModel.find({
      receiveId: id,
      status: 'PENDING',
    }).select('senderId');

    const senderIds = friendListIds.map(function (user) {
      return user.senderId;
    });

    const result = await UserModel.find({ _id: { $in: senderIds } });

    return dataSelectedByKeys(result, ['_id', 'nickname', 'username']);
  }

  async getMyFriends(id: string) {
    const friendListIds = await filterFriendsById(id);
    const result = await UserModel.find({ _id: { $in: friendListIds } });
    return dataSelectedByKeys(result, ['_id', 'nickname', 'username']);
  }

  async updateStatusFriend(data: {
    senderId: string;
    receiverId: string;
    status: string;
  }) {
    await FriendShipModel.updateOne(
      { senderId: data.senderId, receiveId: data.receiverId },
      { status: data.status },
    );
  }

  async searchFriendByKeyword({
    id,
    keyword,
  }: {
    id: string;
    keyword: string;
  }) {
    const friendListIds = await filterFriendsById(id);
    const result = await UserModel.find({
      nickname: { $regex: keyword },
      _id: { $in: friendListIds },
    });
    return dataSelectedByKeys(result, ['_id', 'nickname', 'username']);
  }
}

export default new FriendRepository();
