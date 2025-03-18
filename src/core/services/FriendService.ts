import { FriendRepository } from '../repositories'
import { FriendRequest } from '../../types'
class FriendService {
  async addFriend(data: FriendRequest) {
    return await FriendRepository.addFriend({
      senderId: data.senderId,
      receiverId: data.receiverId,
      status: data.status
    })
  }

  async getAllUsersNonFriends(userId: string) {
    return await FriendRepository.GetAllUsersNonFriends(userId)
  }

  async getFriendRequest(userId: string) {
    return await FriendRepository.GetFriendRequests(userId)
  }

  async getMyFriends(id: string) {
    return await FriendRepository.getMyFriends(id)
  }

  async updateStatusFriend(data: FriendRequest) {
    return await FriendRepository.updateStatusFriend(data)
  }

  async searchFriendByKeyword({
    userId,
    keyword
  }: {
    userId: string
    keyword: string
  }) {
    return await FriendRepository.searchFriendByKeyword({
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
    return await FriendRepository.unfriend({
      senderId,
      friendId
    })
  }
}

export default new FriendService()
