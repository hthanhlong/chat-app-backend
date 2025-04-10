import { PrismaClient } from '@prisma/client'
import RedisService from './RedisService'
import multer from 'multer'
import sharp from 'sharp'
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

  static getMulter() {
    const multerConfig = {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
      }
    }
    return multer(multerConfig)
  }

  static compressImage(file: Express.Multer.File) {
    const image = sharp(file.buffer)
    return image.resize({ width: 1024, height: 1024 }).toBuffer()
  }
}

export default Utils
