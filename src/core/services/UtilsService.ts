import { PrismaClient } from '@prisma/client'
import RedisService from './RedisService'
const prisma = new PrismaClient()

class Utils {
  static async getUserIdFromUserUuid(uuid: string) {
    if (!uuid) return null
    const cachedId = await RedisService.getIdByUUID(uuid)
    if (cachedId) {
      return cachedId
    }
    const result = await prisma.user.findFirst({
      where: { uuid }
    })
    if (result) {
      RedisService.setIdByUUID(uuid, result.id)
      return result.id
    }
    return null
  }
}

export default Utils
