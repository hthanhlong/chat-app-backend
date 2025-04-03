import { FriendShipRepository } from '../repositories'
import NotificationService from './NotificationService'
import UserService from './UserService'
import WsService from './WsService'
import RedisService from './RedisService'
import { User } from '@prisma/client'
import Utils from './UtilsService'
class FriendShipService {
  async addFriend(data: FriendRequest) {
    const receiverId = await Utils.getUserIdFromUserUuid(data.receiverUuid)
    if (!receiverId) return false

    await FriendShipRepository.addFriend({
      senderId: data.senderId,
      receiverId,
      status: data.status
    })

    await NotificationService.createNotification({
      userUuid: data.receiverUuid,
      type: 'FRIEND',
      content: `${data.senderNickName} has sent you a friend request`,
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
          (id) => id === user.id
        )
      })
      return nonFriends
    }
    if (!nonFriends) return []

    const sanitizedFriends = nonFriends.map((user: User) => {
      const { id, ...rest } = user
      return rest
    })

    return sanitizedFriends
  }

  async getFriendRequest(userId: number) {
    return await FriendShipRepository.GetFriendRequests(userId)
  }

  async getMyFriendsByUuid(userUuid: string): Promise<User[]> {
    const id = await Utils.getUserIdFromUserUuid(userUuid)
    if (!id) return []
    return await this.getMyFriendsById(id)
  }

  async getMyFriendsById(userId: number): Promise<User[]> {
    return await FriendShipRepository.getMyFriends(userId)
  }

  async updateStatusFriend(data: FriendRequest) {
    const receiverId = await Utils.getUserIdFromUserUuid(data.receiverUuid)
    if (!receiverId) return false
    const result = await FriendShipRepository.updateStatusFriend({
      senderId: data.senderId,
      receiverId,
      status: data.status
    })
    if (!result) return false
    if (result?.status === 'FRIEND') {
      await NotificationService.createNotification({
        userUuid: data.receiverUuid,
        type: 'FRIEND',
        content: `${data.senderNickName} has accepted your friend request`,
        status: 'UNREAD'
      })

      RedisService.delete(
        RedisService.CACHE_KEYS.get_friend_list_by_id(data.senderId)
      )
      RedisService.delete(
        RedisService.CACHE_KEYS.get_friend_list_by_id(receiverId)
      )

      WsService.sendDataToClientByUuid(data.senderUuid, {
        type: 'UPDATE_FRIEND_LIST',
        payload: null
      })

      WsService.sendDataToClientByUuid(data.receiverUuid, {
        type: 'UPDATE_FRIEND_LIST',
        payload: null
      })

      WsService.sendDataToClientByUuid(data.receiverUuid, {
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
    friendUuid
  }: {
    senderId: number
    friendUuid: string
  }) {
    const friendId = await Utils.getUserIdFromUserUuid(friendUuid)
    if (!friendId) return false
    return await FriendShipRepository.unfriend({
      senderId,
      friendId
    })
  }
}

export default new FriendShipService()
