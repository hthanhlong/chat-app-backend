import { dataSelectedByKeys } from '../../utils'
import { FriendShipStatus, PrismaClient, User } from '@prisma/client'
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
        userId_1: data.senderId,
        userId_2: data.receiverId,
        status: data.status as FriendShipStatus
      }
    })
  }

  async GetAllUsersNonFriends(userId: number) {
    const friendListIds = await prisma.friendShip.findMany({
      where: {
        OR: [{ userId_1: userId }, { userId_2: userId }]
      },
      take: 100
    })

    const friendIds = friendListIds.map(function (user: {
      userId_1: number
      userId_2: number
    }) {
      if (user.userId_1 === userId) {
        return user.userId_2
      }
      if (user.userId_2 === userId) {
        return user.userId_1
      }
    })

    return friendIds
  }

  async getFriendListIdsByUserId(id: number) {
    const friendListIds = await prisma.friendShip.findMany({
      where: {
        OR: [{ userId_1: id }, { userId_2: id }],
        status: FriendShipStatus.FRIEND
      },
      take: 100
    })

    const friendIds = friendListIds.map(function (user: {
      userId_1: number
      userId_2: number
    }) {
      if (user.userId_1.toString() === id.toString()) {
        return user.userId_2
      }
      if (user.userId_2.toString() === id.toString()) {
        return user.userId_1
      }
    })

    return friendIds
  }

  async GetFriendRequests(userId: number) {
    const friendRequests = await prisma.friendShip.findMany({
      where: {
        userId_2: userId,
        status: FriendShipStatus.PENDING
      }
    })

    const senderIds = friendRequests.map(function (user: {
      userId_1: number
      userId_2: number
    }) {
      if (user.userId_1.toString() === userId.toString()) {
        return user.userId_2
      }
      if (user.userId_2.toString() === userId.toString()) {
        return user.userId_1
      }
    })

    const result = await prisma.user.findMany({
      where: { id: { in: senderIds.filter((id) => id !== undefined) } }
    })

    return dataSelectedByKeys(result, ['uuid', 'nickName', 'name'])
  }

  async getMyFriends(id: number): Promise<User[]> {
    const friendListIds = await this.getFriendListIdsByUserId(id)
    if (!friendListIds) return []
    const friends = await prisma.user.findMany({
      where: { id: { in: friendListIds.filter((id) => id !== undefined) } }
    })
    return dataSelectedByKeys(friends, [
      'uuid',
      'nickName',
      'name',
      'profilePicUrl',
      'caption'
    ]) as User[]
  }

  async updateStatusFriend(data: {
    senderId: number
    receiverId: number
    status: FriendShipStatus
  }) {
    const friendship = await prisma.friendShip.findFirst({
      where: {
        OR: [
          { userId_1: data.receiverId, userId_2: data.senderId },
          { userId_1: data.senderId, userId_2: data.receiverId }
        ]
      }
    })
    if (friendship) {
      const result = await prisma.friendShip.update({
        where: { id: friendship.id },
        data: {
          status: data.status
        }
      })
      return result
    } else {
      const result = await prisma.friendShip.create({
        data: {
          userId_1: data.receiverId,
          userId_2: data.senderId,
          status: data.status
        }
      })
      return result
    }
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
    return dataSelectedByKeys(result, ['uuid', 'nickName', 'name'])
  }

  async unfriend({
    senderId,
    friendId
  }: {
    senderId: number
    friendId: number
  }) {
    await prisma.friendShip.deleteMany({
      where: {
        OR: [
          { userId_1: senderId, userId_2: friendId },
          { userId_1: friendId, userId_2: senderId }
        ]
      }
    })
  }
}

export default new FriendShipRepository()
