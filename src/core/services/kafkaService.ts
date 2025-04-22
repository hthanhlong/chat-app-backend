import { Message } from './../../../node_modules/.prisma/client/index.d'
import { Kafka, Producer, Consumer } from 'kafkajs'
import LoggerService from './LoggerService'
import FriendShipService from './FriendShipService'
import MessageService from './MessageService'
import envConfig from '../../config'
class KafkaService {
  kafka!: Kafka
  kafkaProducer!: Producer
  kafkaFriendConsumer!: Consumer
  kafkaMessageConsumer!: Consumer

  init() {
    const kafkaHost = envConfig.KAFKA_BROKER_HOST
    this.kafka = new Kafka({
      clientId: 'chat-app',
      brokers: [kafkaHost]
    })
    this.kafkaProducer = this.createKafProducer()
    this.kafkaFriendConsumer = this.createKafConsumer('api-friends-group')
    this.kafkaMessageConsumer = this.createKafConsumer('api-message-group')
    this._checkKafkaConnection()
    this.consumeMessageFromFriendTopic()
    this.consumeMessageFromMessageTopic()
  }

  createKafProducer() {
    return this.kafka.producer()
  }

  createKafConsumer(groupId: string) {
    return this.kafka.consumer({ groupId })
  }

  disconnectKafkaConsumer() {
    this.kafkaFriendConsumer.disconnect()
    this.kafkaMessageConsumer.disconnect()
  }

  disconnectKafkaProducer() {
    this.kafkaProducer.disconnect()
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
        requestId: string | null
        eventName: string
        sendByProducer: 'API_SERVER' | ''
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

  async consumeMessageFromFriendTopic() {
    await this.kafkaFriendConsumer.connect()
    await this.kafkaFriendConsumer.subscribe({
      topic: 'FRIEND_TOPIC',
      fromBeginning: true
    })
    await this.kafkaFriendConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString()
          if (!value) return
          const _value = JSON.parse(value)
          if (_value.sendByProducer === 'API_SERVER') return
          const { uuid, requestId, eventName } = _value
          if (uuid) {
            const friends = await FriendShipService.getMyFriendsByUuid(uuid)
            if (Array.isArray(friends) && friends.length > 0) {
              await this.produceMessageToTopic<{
                friendList: string[]
              }>('FRIEND_TOPIC', {
                key: 'RETURN_FRIENDS_LIST',
                value: {
                  requestId: requestId,
                  eventName: eventName,
                  uuid: uuid,
                  friendList: friends.map((friend) => friend.uuid),
                  sendByProducer: 'API_SERVER'
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

  async consumeMessageFromMessageTopic() {
    await this.kafkaMessageConsumer.connect()
    await this.kafkaMessageConsumer.subscribe({
      topic: 'MESSAGE_TOPIC',
      fromBeginning: true
    })
    await this.kafkaMessageConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString()
          if (!value) return
          const _value = JSON.parse(value) as {
            uuid: string
            data: {
              uuid: string
              senderUuid: string
              receiverUuid: string
              message: string
            }
            requestId: string
            eventName: string
            sendByProducer: string
          }
          if (_value.sendByProducer === 'API_SERVER') return
          const result = await MessageService.createMessage(_value.data)
          if (result) {
            await this.produceMessageToTopic<{
              data: Message
            }>('MESSAGE_TOPIC', {
              key: 'RETURN_MESSAGE',
              value: {
                requestId: _value.requestId,
                eventName: _value.eventName,
                uuid: _value.uuid,
                data: result,
                sendByProducer: 'API_SERVER'
              }
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
