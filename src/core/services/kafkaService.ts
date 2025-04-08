import { Kafka, Producer, Consumer } from 'kafkajs'
import LoggerService from './LoggerService'
import FriendShipService from './FriendShipService'
import MessageService from './MessageService'
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
    this.consumeMessageFromTopicFriendsServiceRequest()
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

  async produceMessageToTopic<T>(
    topic: string,
    data: {
      key: string
      value: T & {
        requestId: string
        eventName: string
        uuid: string
      }
    }
  ) {
    try {
      if (!this.kafkaProducer) return
      await this.kafkaProducer.connect()
      await this.kafkaProducer.send({
        topic,
        messages: [{ key: data.key, value: JSON.stringify(data.value) }]
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

  async consumeMessageFromTopicFriendsServiceRequest() {
    await this.kafkaConsumer.connect()
    await this.kafkaConsumer.subscribe({
      topic: 'friends-service-request',
      fromBeginning: true
    })
    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString()
          if (!value) return
          const _value = JSON.parse(value)
          const { uuid, requestId, eventName } = _value
          if (uuid) {
            const friends = await FriendShipService.getMyFriendsByUuid(uuid)
            if (Array.isArray(friends) && friends.length > 0) {
              await this.produceMessageToTopic<{
                friendList: string[]
              }>('friends-service-response', {
                key: 'RETURN_FRIENDS_LIST',
                value: {
                  requestId: requestId,
                  eventName: eventName,
                  uuid: uuid,
                  friendList: friends.map((friend) => friend.uuid)
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

  async consumeMessageFromTopicMessageServiceRequest() {
    await this.kafkaConsumer.connect()
    await this.kafkaConsumer.subscribe({
      topic: 'message-service-request',
      fromBeginning: true
    })
    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString()
          if (!value) return
          const _value = JSON.parse(value)
          const { senderUuid, receiverUuid, message: _message } = _value
          if (senderUuid && receiverUuid && _message) {
            await MessageService.createMessage({
              senderUuid,
              receiverUuid,
              message: _message
            })
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
