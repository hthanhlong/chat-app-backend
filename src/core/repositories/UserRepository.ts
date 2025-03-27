import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

class UserRepository {
  async getAllUsers(id: number) {
    const users = await prisma.user.findMany({
      where: { id: { not: id } },
      take: 20
    })
    return users
  }

  async createUser(user: User) {
    const createdUser = await prisma.user.create({
      data: user
    })
    return createdUser
  }

  async updateUserById(id: number, user: User) {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: user
    })
    return updatedUser
  }

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  }

  async findUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        profilePicUrl: true,
        caption: true,
        nickName: true
      }
    })

    return user
  }

  async findUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        name: username
      }
    })
    return user
  }
}

export default new UserRepository()
