import { dataSelectedByKeys } from '../../utils'
import { UserModel, FriendShipModel } from '../../database/model'

const regexPattern = /[-[\]{}()*+?.,\\^$|#\s]/g // todo: refactor

class FriendShipRepository {
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
  }

  async GetAllUsersNonFriends(userId: string) {
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

    return friendIds
  }

  async getFriendListIdsByUserId(id: string) {
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

  async GetFriendRequests(userId: string) {
    const friendRequests = await FriendShipModel.find({
      receiveId: userId,
      status: 'PENDING'
    })

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
    const friendListIds = await this.getFriendListIdsByUserId(id)
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
    if (result) {
      return result
    }
    return false
  }

  async searchFriendByKeyword({
    userId,
    keyword
  }: {
    userId: string
    keyword: string
  }) {
    const friendListIds = await this.getFriendListIdsByUserId(userId)
    const result = await UserModel.find({
      nickname: {
        $regex: keyword.replace(regexPattern, '\\$&'),
        $options: 'i'
      },
      _id: { $in: friendListIds.filter((id: string) => id !== undefined) }
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
}

export default new FriendShipRepository()
