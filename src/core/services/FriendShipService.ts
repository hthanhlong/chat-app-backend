import { FriendShipRepository } from '../repositories'
import { FriendRequest } from '../../types'
import NotificationService from './NotificationService'
import UserService from './UserService'
import WsService from './WsService'
import RedisService from './RedisService'
import { User } from '@prisma/client'
class FriendShipService {
  async addFriend(data: FriendRequest) {
    await FriendShipRepository.addFriend({
      senderId: data.senderId,
      receiverId: data.receiverId,
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

    return true
  }

  async getAllUsersNonFriends(userId: number) {
    const ids = await FriendShipRepository.GetAllUsersNonFriends(userId)

    let nonFriends = await UserService.getAllUsers(userId)
    if (Array.isArray(ids) && ids.length > 0) {
      if (!nonFriends) return []
      nonFriends = nonFriends.filter((user: User) => {
        return !ids.some(
          // @ts-ignore
          (id) => id.toString() === user._id.toString()
        )
      })
      return nonFriends
    }
    return nonFriends
  }

  async getFriendRequest(userId: number) {
    return await FriendShipRepository.GetFriendRequests(userId)
  }

  async getMyFriends(id: number) {
    return await FriendShipRepository.getMyFriends(id)
  }

  async updateStatusFriend(data: FriendRequest) {
    const result = await FriendShipRepository.updateStatusFriend(data)
    if (!result) return false
    if (result?.status === 'FRIEND') {
      const user = await UserService.findUserById(data.receiverId)

      await NotificationService.createNotification({
        senderId: data.receiverId,
        receiverId: data.senderId,
        type: 'FRIEND',
        content: `${user.nickname} has accepted your friend request`,
        status: 'UNREAD'
      })

      RedisService.delete(
        RedisService.CACHE_KEYS.get_friend_list_by_id(data.senderId)
      )
      RedisService.delete(
        RedisService.CACHE_KEYS.get_friend_list_by_id(data.receiverId)
      )

      WsService.sendDataToClientById(data.senderId, {
        type: 'UPDATE_FRIEND_LIST',
        payload: null
      })

      WsService.sendDataToClientById(data.receiverId, {
        type: 'UPDATE_FRIEND_LIST',
        payload: null
      })

      WsService.sendDataToClientById(data.receiverId, {
        type: 'HAS_NEW_NOTIFICATION',
        payload: null
      })
    }

    return true
  }

  async searchFriendByKeyword({
    userId,
    keyword
  }: {
    userId: number
    keyword: string
  }) {
    return await FriendShipRepository.searchFriendByKeyword({
      userId,
      keyword
    })
  }

  async unfriend({
    senderId,
    friendId
  }: {
    senderId: number
    friendId: number
  }) {
    return await FriendShipRepository.unfriend({
      senderId,
      friendId
    })
  }
}

export default new FriendShipService()
