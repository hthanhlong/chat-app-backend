import { dataSelectedByKeys } from '../../utils'
import { FriendShipStatus, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// const regexPattern = /[-[\]{}()*+?.,\\^$|#\s]/g // todo: refactor

class FriendShipRepository {
  async addFriend(data: {
    senderId: number
    receiverId: number
    status: string
  }) {
    await prisma.friendShip.create({
      data: {
        userId: data.senderId,
        friendId: data.receiverId,
        status: data.status as FriendShipStatus
      }
    })
  }

  async GetAllUsersNonFriends(userId: number) {
    const friendListIds = await prisma.friendShip.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }]
      },
      take: 100
    })

    const friendIds = friendListIds.map(function (user: {
      userId: number
      friendId: number
    }) {
      if (user.userId.toString() === userId.toString()) {
        return user.friendId
      }
      if (user.friendId.toString() === userId.toString()) {
        return user.userId
      }
    })

    return friendIds
  }

  async getFriendListIdsByUserId(id: number) {
    const friendListIds = await prisma.friendShip.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
        status: FriendShipStatus.FRIEND
      },
      take: 100
    })

    const friendIds = friendListIds.map(function (user: {
      userId: number
      friendId: number
    }) {
      if (user.userId.toString() === id.toString()) {
        return user.friendId
      }
      if (user.friendId.toString() === id.toString()) {
        return user.userId
      }
    })

    return friendIds
  }

  async GetFriendRequests(userId: number) {
    const friendRequests = await prisma.friendShip.findMany({
      where: {
        friendId: userId,
        status: FriendShipStatus.PENDING
      }
    })

    const senderIds = friendRequests.map(function (user: {
      userId: number
      friendId: number
    }) {
      if (user.userId.toString() === userId.toString()) {
        return user.friendId
      }
      if (user.friendId.toString() === userId.toString()) {
        return user.userId
      }
    })

    const result = await prisma.user.findMany({
      where: { id: { in: senderIds.filter((id) => id !== undefined) } }
    })

    return dataSelectedByKeys(result, ['id', 'nickName', 'name'])
  }

  async getMyFriends(id: number) {
    const friendListIds = await this.getFriendListIdsByUserId(id)
    if (!friendListIds) return []
    const friends = await prisma.user.findMany({
      where: { id: { in: friendListIds.filter((id) => id !== undefined) } }
    })
    return dataSelectedByKeys(friends, ['id', 'nickName', 'name'])
  }

  async updateStatusFriend(data: {
    senderId: number
    receiverId: number
    status: string
  }) {
    const result = await prisma.friendShip.update({
      where: {
        id: await prisma.friendShip
          .findFirst({
            where: {
              userId: data.receiverId,
              friendId: data.senderId
            },
            select: {
              id: true
            }
          })
          .then((result) => result?.id)
      },
      data: { status: data.status as FriendShipStatus }
    })
    if (result) {
      return result
    }
    return false
  }

  async searchFriendByKeyword({
    userId,
    keyword
  }: {
    userId: number
    keyword: string
  }) {
    const friendListIds = await this.getFriendListIdsByUserId(userId)
    const result = await prisma.user.findMany({
      where: {
        nickName: {
          contains: keyword,
          mode: 'insensitive'
        },
        id: { in: friendListIds.filter((id) => id !== undefined) }
      }
    })
    return dataSelectedByKeys(result, ['id', 'nickName', 'name'])
  }

  async unfriend({
    senderId,
    friendId
  }: {
    senderId: string
    friendId: string
  }) {
    await prisma.friendShip.deleteMany({
      where: {
        OR: [
          { userId: parseInt(senderId), friendId: parseInt(friendId) },
          { userId: parseInt(friendId), friendId: parseInt(senderId) }
        ]
      }
    })
  }
}

export default new FriendShipRepository()
