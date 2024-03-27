import { FriendShipModel } from '../database/model/FriendShip'

export const filterFriendsById = async (id: string) => {
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
