import { dataSelectedByKeys } from '../../utils'
import { UserModel, FriendShipModel } from '../../database/model'
import { UserService, NotificationService } from '../services'
import { IUser } from '../../database/model/User'

class FriendRepository {
  async SendFriendRequest(data: {
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
      // @ts-ignore
      content: `${user.nickname} has sent you a friend request`,
      status: 'UNREAD'
    })
  }

  async GetAllUsersNonFriends(id: string) {
    const friendListIds = await FriendShipModel.find({
      $or: [{ senderId: id }, { receiveId: id }]
    }).limit(100)

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

    let nonFriends = await UserService.getAllUsers(id)
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

  async GetFriendRequests(id: string) {
    const friendListIds = await FriendShipModel.find({
      receiveId: id,
      status: 'PENDING'
    })
      .select('senderId')
      .skip(0)
      .limit(100)

    const senderIds = friendListIds.map(function (user: {
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
    // @ts-ignore
    const friends = await UserModel.find({ _id: { $in: friendListIds } })
    return dataSelectedByKeys(friends, ['_id', 'nickname', 'username'])
  }

  async updateStatusFriend(data: {
    senderId: string
    receiverId: string
    status: string
  }) {
    const options = { upsert: true, new: true, runValidators: true }
    await FriendShipModel.findOneAndUpdate(
      { senderId: data.senderId, receiveId: data.receiverId },
      { $set: { status: data.status } },
      options
    )
    const user = await UserService.findUserById(data.receiverId)
    if (!user) return

    // to do more
    if (data.status === 'FRIEND') {
      await NotificationService.createNotification({
        senderId: data.receiverId,
        receiverId: data.senderId,
        type: 'FRIEND',
        // @ts-ignore
        content: `${user.nickname} has accepted your friend request`,
        status: 'UNREAD'
      })
    }
  }

  async searchFriendByKeyword({
    id,
    keyword
  }: {
    id: string
    keyword: string
  }) {
    const friendListIds = await this._filterFriendsById(id)
    if (!friendListIds) return []
    const result = await UserModel.find({
      nickname: { $regex: keyword },
      _id: { $in: friendListIds.filter((id) => id !== undefined) }
    })
    return dataSelectedByKeys(result, ['_id', 'nickname', 'username'])
  }

  async unfriend({
    senderId,
    receiverId
  }: {
    senderId: string
    receiverId: string
  }) {
    await FriendShipModel.findOneAndDelete({
      $or: [
        { senderId: senderId, receiveId: receiverId },
        { senderId: receiverId, receiveId: senderId }
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
