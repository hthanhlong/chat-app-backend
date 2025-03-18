import { dataSelectedByKeys } from '../../utils'
import { UserModel, FriendShipModel } from '../../database/model'
import { UserService, NotificationService } from '../services'
import { IUser } from '../../database/model/User'

const regexPattern = /[-[\]{}()*+?.,\\^$|#\s]/g // todo: refactor

class FriendRepository {
  async addFriend(data: {
    senderId: string
    receiverId: string
    status: string
  }) {
    await FriendShipModel.create({
      senderId: data.senderId,
      receiveId: data.receiverId,
      status: data.status
    })

    const user = await UserService.findUserById(data.senderId)

    await NotificationService.createNotification({
      senderId: data.senderId,
      receiverId: data.receiverId,
      type: 'FRIEND',
      content: `${user.nickname} has sent you a friend request`,
      status: 'UNREAD'
    })
  }

  async GetAllUsersNonFriends(userId: string) {
    console.log('userId', userId)

    const friendListIds = await FriendShipModel.find({
      $or: [{ senderId: userId }, { receiveId: userId }]
    }).limit(100)

    const friendIds = friendListIds.map(function (user: {
      senderId: string
      receiveId: string
    }) {
      if (user.senderId.toString() === userId.toString()) {
        return user.receiveId
      }
      if (user.receiveId.toString() === userId.toString()) {
        return user.senderId
      }
    })

    let nonFriends = await UserService.getAllUsers(userId)
    if (Array.isArray(friendListIds) && friendListIds.length > 0) {
      if (!nonFriends) return []
      nonFriends = nonFriends.filter((user: IUser) => {
        return !friendIds.some(
          // @ts-ignore
          (id) => id.toString() === user._id.toString()
        )
      })
      return nonFriends
    }
    return nonFriends
  }

  async GetFriendRequests(userId: string) {
    const friendRequests = await FriendShipModel.find({
      receiveId: userId,
      status: 'PENDING'
    })

    console.log('friendRequests', friendRequests)

    const senderIds = friendRequests.map(function (user: {
      senderId: string
      receiveId: string
    }) {
      return user.senderId
    })

    const result = await UserModel.find({ _id: { $in: senderIds } })

    return dataSelectedByKeys(result, ['_id', 'nickname', 'username'])
  }

  async getMyFriends(id: string) {
    const friendListIds = await this._filterFriendsById(id)
    if (!friendListIds) return []
    const friends = await UserModel.find({ _id: { $in: friendListIds } })
    return dataSelectedByKeys(friends, ['_id', 'nickname', 'username'])
  }

  async updateStatusFriend(data: {
    senderId: string
    receiverId: string
    status: string
  }) {
    const result = await FriendShipModel.findOneAndUpdate(
      { senderId: data.receiverId, receiveId: data.senderId },
      { $set: { status: data.status } },
      { new: true, upsert: true }
    )
    if (result?.status === 'FRIEND') {
      const user = await UserService.findUserById(data.receiverId)
      await NotificationService.createNotification({
        senderId: data.receiverId,
        receiverId: data.senderId,
        type: 'FRIEND',
        content: `${user.nickname} has accepted your friend request`,
        status: 'UNREAD'
      })
    }
    return true
  }

  async searchFriendByKeyword({
    userId,
    keyword
  }: {
    userId: string
    keyword: string
  }) {
    // to do refactor - because call 2
    const friendListIds = await this._filterFriendsById(userId) // get list friends by id
    const result = await UserModel.find({
      nickname: {
        $regex: keyword.replace(regexPattern, '\\$&'),
        $options: 'i'
      },
      _id: { $in: friendListIds.filter((id) => id !== undefined) }
    })
    return dataSelectedByKeys(result, ['_id', 'nickname', 'username'])
  }

  async unfriend({
    senderId,
    friendId
  }: {
    senderId: string
    friendId: string
  }) {
    await FriendShipModel.findOneAndDelete({
      $or: [
        { senderId: senderId, receiveId: friendId },
        { senderId: friendId, receiveId: senderId }
      ]
    })
  }

  async _filterFriendsById(id: string) {
    const friendListIds = await FriendShipModel.find({
      $or: [{ senderId: id }, { receiveId: id }],
      $and: [{ status: 'FRIEND' }]
    })

    const friendIds = friendListIds.map(function (user: {
      senderId: string
      receiveId: string
    }) {
      if (user.senderId.toString() === id.toString()) {
        return user.receiveId
      }
      if (user.receiveId.toString() === id.toString()) {
        return user.senderId
      }
    })
    return friendIds
  }
}

export default new FriendRepository()
