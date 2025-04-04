import { ProducerEvents } from './../../../node_modules/kafkajs/types/index.d'
import { Kafka, Producer, Consumer } from 'kafkajs'
import LoggerService from './LoggerService'
import FriendShipService from './FriendShipService'
import { User } from '@prisma/client'
class KafkaService {
  kafka!: Kafka
  kafkaProducer!: Producer
  kafkaConsumer!: Consumer
  groupId = 'api-friends-service'

  init() {
    this.kafka = new Kafka({
      clientId: 'chat-app',
      brokers: ['localhost:19092']
    })
    this.kafkaProducer = this.createKafProducer()
    this.kafkaConsumer = this.createKafConsumer(this.groupId)
    this._checkKafkaConnection()
    this.consumeMessageFromTopic('friends-service-request')
  }

  createKafProducer() {
    return this.kafka.producer()
  }

  createKafConsumer(groupId: string) {
    return this.kafka.consumer({ groupId })
  }

  async _checkKafkaConnection() {
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

  async produceMessageToTopic<T>(topic: string, data: T) {
    try {
      if (!this.kafkaProducer) return
      await this.kafkaProducer.connect()
      await this.kafkaProducer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }]
      })
    } catch (error) {
      LoggerService.error({
        where: 'KafkaService',
        message: `Error producing message to topic ${topic}: ${error}`
      })
      throw error
    } finally {
      if (!this.kafkaProducer) return
      await this.kafkaProducer.disconnect()
    }
  }

  async consumeMessageFromTopic(topic: string) {
    await this.kafkaConsumer.connect()
    await this.kafkaConsumer.subscribe({
      topic,
      fromBeginning: true
    })
    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString()
          if (!value) return
          const _value = JSON.parse(value)
          const { data, requestId } = _value
          if (data.uuid) {
            const friends = await FriendShipService.getMyFriendsByUuid(
              data.uuid
            )
            if (Array.isArray(friends) && friends.length > 0) {
              await this.produceMessageToTopic('friends-service-response', {
                requestId,
                data: {
                  event: data.event,
                  uuid: data.uuid,
                  friends: friends
                }
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

export default new KafkaService()
