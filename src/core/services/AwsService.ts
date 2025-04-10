import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import envConfig from '../../config'

class AwsService {
  private s3: S3Client
  constructor() {
    this.s3 = new S3Client({
      region: envConfig.AWS_REGION,
      credentials: {
        accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY
      }
    })
  }

  putObjectAwsCommand(file: {
    originalname: string
    buffer: Buffer
    mimetype: string
  }) {
    const key = `${uuidv4()}-${Date.now()}`
    const command = new PutObjectCommand({
      Bucket: envConfig.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
    return {
      command,
      key
    }
  }

  getS3Client() {
    return this.s3
  }

  async uploadFile(file: {
    originalname: string
    buffer: Buffer
    mimetype: string
  }): Promise<string> {
    const { command, key } = this.putObjectAwsCommand(file)
    await this.s3.send(command)
    return `https://${envConfig.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
  }
}

export default new AwsService()
