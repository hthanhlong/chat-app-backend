import { FriendShipModel } from './../database/model/FriendShip';
import UserService from '../services/UserService';
import User from '../database/model/User';

class FriendRepository {
  async SendFriendRequest(data: {
    senderId: string;
    receiverId: string;
    status: string;
  }) {
    const result = await FriendShipModel.create({
      senderId: data.senderId,
      receiveId: data.receiverId,
      status: data.status,
    });
    console.log('result', result);
  }

  async GetAllUsersNonFriends(id: string) {
    const friendListIds = await FriendShipModel.find({
      senderId: id,
    }).select('receiveId');

    const allUsers = await UserService.getAllUsers(id);
    if (Array.isArray(friendListIds) && friendListIds.length > 0) {
      if (!allUsers) return [];
      const result = allUsers.filter((user: User) => {
        return !friendListIds.some(
          // @ts-ignore
          (friend) => friend.receiveId.toString() === user._id.toString(),
        );
      });
      return result;
    }

    return allUsers;
  }

  async GetFriendRequests(id: string) {
    const friendListIds = await FriendShipModel.find({
      receiveId: id,
      status: 'PENDING',
    }).select('senderId');

    console.log('friendListIds', friendListIds);

    return friendListIds;
  }
}

export default new FriendRepository();
