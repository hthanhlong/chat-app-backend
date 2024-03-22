import FriendRepository from '../repositories/FriendRepository';

class FriendService {
  async sendFriendRequest(data: FriendRequest) {
    return await FriendRepository.SendFriendRequest(data);
  }

  async getAllUsersNonFriends(id: string) {
    return await FriendRepository.GetAllUsersNonFriends(id);
  }

  async getFriendRequest(id: string) {
    return await FriendRepository.GetFriendRequests(id);
  }

  async getMyFriends(id: string) {
    return await FriendRepository.getMyFriends(id);
  }

  async updateStatusFriend(data: FriendRequest) {
    return await FriendRepository.updateStatusFriend(data);
  }

  async searchFriendByKeyword({
    id,
    keyword,
  }: {
    id: string;
    keyword: string;
  }) {
    return await FriendRepository.searchFriendByKeyword({
      id,
      keyword,
    });
  }
}

export default new FriendService();
