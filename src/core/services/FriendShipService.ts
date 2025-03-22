import { FriendShipRepository } from '../repositories'
import { FriendRequest } from '../../types'
import NotificationService from './NotificationService'
import UserService from './UserService'
import WsService from './WsService'
import RedisService from './RedisService'

class FriendShipService {
  async addFriend(data: FriendRequest) {
    return await FriendShipRepository.addFriend({
      senderId: data.senderId,
      receiverId: data.receiverId,
      status: data.status
    })
  }

  async getAllUsersNonFriends(userId: string) {
    return await FriendShipRepository.GetAllUsersNonFriends(userId)
  }

  async getFriendRequest(userId: string) {
    return await FriendShipRepository.GetFriendRequests(userId)
  }

  async getMyFriends(id: string) {
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
    userId: string
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
    senderId: string
    friendId: string
  }) {
    return await FriendShipRepository.unfriend({
      senderId,
      friendId
    })
  }
}

export default new FriendShipService()
