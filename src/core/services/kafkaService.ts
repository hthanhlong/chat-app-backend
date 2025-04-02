import { Kafka, Producer, Consumer } from 'kafkajs'
import LoggerService from './LoggerService'
import FriendShipService from './FriendShipService'

class KafkaService {
  static kafka: Kafka
  static kafkaProducer: Producer
  static kafkaConsumerFriendsService: Consumer

  static async initKafka() {
    this.kafka = new Kafka({
      clientId: 'chat-app',
      brokers: ['localhost:19092']
    })
    await this._checkKafkaConnection()
    this.kafkaProducer = await this.createKafkaProducer()
    this.kafkaConsumerFriendsService =
      await this.createKafkaConsumer('friends-service')
  }

  static async createKafkaProducer() {
    this.kafkaProducer = this.kafka.producer()
    try {
      await this.kafkaProducer.connect()
    } catch (error) {
      LoggerService.error({
        where: 'KafkaService',
        message: `❌ Kafka producer connection failed: ${error}`
      })
    }
    return this.kafkaProducer
  }

  static async createKafkaConsumer(groupId: string) {
    const kafkaConsumer = this.kafka.consumer({ groupId })
    try {
      await kafkaConsumer.connect()
    } catch (error) {
      LoggerService.error({
        where: 'KafkaService',
        message: `❌ Kafka consumer connection failed: ${error}`
      })
    }
    return kafkaConsumer
  }

  static async _checkKafkaConnection() {
    try {
      const admin = this.kafka.admin()
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

  static async consumeFriendsService() {
    await this.kafkaConsumerFriendsService.connect()
    await this.kafkaProducer.connect()
    this.kafkaConsumerFriendsService.subscribe({
      topic: 'friends-service-request',
      fromBeginning: true
    })
    this.kafkaConsumerFriendsService.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString()
        if (value) {
          const { userUuid } = JSON.parse(value)
          console.log({
            userUuid
          })
          const friends = await FriendShipService.getMyFriendsByUuid(
            userUuid as string
          )
          this.kafkaProducer.send({
            topic: 'friends-service-response',
            messages: [{ value: JSON.stringify(friends) }]
          })
        }
      }
    })
  }
}

export default KafkaService
