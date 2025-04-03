import { ProducerEvents } from './../../../node_modules/kafkajs/types/index.d'
import { Kafka, Producer, Consumer } from 'kafkajs'
import LoggerService from './LoggerService'
import FriendShipService from './FriendShipService'
import { User } from '@prisma/client'
class KafkaService {
  static _kafka: Kafka
  static _kafkaProducer: Producer
  static _kafkaConsumerFriendsService: Consumer
  static groupId = 'api-friends-service'

  static async initKafka() {
    this._kafka = new Kafka({
      clientId: 'chat-app',
      brokers: ['localhost:19092']
    })
    this._kafkaProducer = this.createKafProducer()
    this._kafkaConsumerFriendsService = this.createKafConsumer(this.groupId)
    await this._checkKafkaConnection()
    await this.consumeFriendsService()
  }

  static createKafProducer() {
    return this._kafka.producer()
  }

  static createKafConsumer(groupId: string) {
    return this._kafka.consumer({ groupId })
  }

  static async _checkKafkaConnection() {
    try {
      const admin = this._kafka.admin()
      await admin.connect()
      LoggerService.info({
        where: 'KafkaService',
        message: '✅ Kafka connected successfully!'
      })
      const topics = await admin.listTopics()
      LoggerService.info({
        where: 'KafkaService',
        message: `Available topics: ${topics}`
      })
      await admin.disconnect()
    } catch (error) {
      LoggerService.error({
        where: 'KafkaService',
        message: `❌ Kafka connection failed: ${error}`
      })
    }
  }

  static async produceMessage<T>({
    topic,
    message
  }: {
    topic: string
    message: T
  }) {
    await this._kafkaProducer.connect()
    await this._kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    })
    await this._kafkaProducer.disconnect()
  }

  static async consumeFriendsService() {
    await this._kafkaConsumerFriendsService.disconnect()
    await this._kafkaConsumerFriendsService.connect()
    await this._kafkaConsumerFriendsService.subscribe({
      topic: 'friends-service-request',
      fromBeginning: true
    })
    await this._kafkaConsumerFriendsService.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString()
          if (value) {
            const { userUuid } = JSON.parse(value)
            const friends = await FriendShipService.getMyFriendsByUuid(userUuid)
            if (Array.isArray(friends) && friends.length > 0) {
              console.log('friends', friends)
              await this.produceMessage<User[]>({
                topic: 'friends-service-response',
                message: friends
              })
            }
          }
        } catch (error) {
          LoggerService.error({
            where: 'KafkaService',
            message: `❌ Kafka producer connection failed: ${error}`
          })
        }
      }
    })
  }
}

export default KafkaService
