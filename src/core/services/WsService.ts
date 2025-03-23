import JWTService from './JWTService'
import MessageService from './MessageService'
import FriendShipService from './FriendShipService'
import {
  JWT_PAYLOAD,
  WebSocketEvent,
  IRequest,
  ISocketEventGetOnlineUsers,
  ISocketEventSendMessage
} from '../../types'
import RedisService from './RedisService'
import LoggerService from './LoggerService'

class WsService {
  static SOCKET_EVENTS = {
    GET_ONLINE_USERS: 'GET_ONLINE_USERS',
    SEND_MESSAGE: 'SEND_MESSAGE',
    HAS_NEW_MESSAGE: 'HAS_NEW_MESSAGE',
    UPDATE_FRIEND_LIST: 'UPDATE_FRIEND_LIST',
    CLOSE_CONNECTION: 'CLOSE_CONNECTION',
    GET_FRIEND_LIST: 'GET_FRIEND_LIST',
    GET_FRIEND_REQUEST: 'GET_FRIEND_REQUEST',
    SEND_FRIEND_REQUEST: 'SEND_FRIEND_REQUEST',
    ACCEPT_FRIEND_REQUEST: 'ACCEPT_FRIEND_REQUEST',
    REJECT_FRIEND_REQUEST: 'REJECT_FRIEND_REQUEST',
    HAS_NEW_NOTIFICATION: 'HAS_NEW_NOTIFICATION',
    GET_NOTIFICATIONS: 'GET_NOTIFICATIONS',
    UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION'
  }

  static clients: Map<string, WebSocket> = new Map()

  static onConnection(socket: any, req: IRequest): void {
    const accessToken = req.url?.split('?')[1].split('accessToken=')[1]
    if (!accessToken) {
      socket.close(1008, 'No access token provided')
      return
    }
    try {
      const data: JWT_PAYLOAD = JWTService.verifyAccessToken(accessToken)
      WsService.clients.set(data.userId, socket)
      RedisService.publishClients(
        JSON.stringify({
          type: WsService.SOCKET_EVENTS.GET_ONLINE_USERS,
          payload: {
            userId: data.userId
          }
        })
      )
      RedisService.subOnMessage((channel, message) => {
        if (channel === RedisService.CHANNELS.clients_connected) {
          const data = JSON.parse(message)
          const { type, payload } = data
          if (type === WsService.SOCKET_EVENTS.GET_ONLINE_USERS) {
            const { userId } = payload as ISocketEventGetOnlineUsers
            if (!WsService.clients.has(userId)) {
              WsService.clients.set(userId, socket)
            }
          }
        }
      })
      socket.on('message', (event: WebSocketEvent) =>
        WsService._onMessage(event, req)
      )
      socket.on('error', (err: any) =>
        LoggerService.error({
          where: 'WsService',
          message: `Error on socket: ${err.message}`
        })
      )
      socket.on('close', () => {
        WsService.clients.delete(data.userId)
      })
    } catch (error: Error | any) {
      socket.close(1008, 'INVALID_ACCESS_TOKEN')
      LoggerService.error({
        where: 'WsService',
        message: `Error on connection: ${error.message}`
      })
    }
  }

  static async _onMessage(event: WebSocketEvent, req: IRequest): Promise<void> {
    try {
      const data = JSON.parse(event as any)
      if (!data.type || !data.payload) return
      const clientIds = Array.from(WsService.clients.keys())
      const { type, payload } = data
      switch (type) {
        case WsService.SOCKET_EVENTS.GET_ONLINE_USERS:
          const { userId } = payload as ISocketEventGetOnlineUsers
          const user = WsService.clients.get(userId)
          if (!user) return WsService.closeConnection(userId)
          const friends = await FriendShipService.getMyFriends(userId)
          const onlineUsers = clientIds.filter((id: string) =>
            friends?.some((friend: any) => friend._id.toString() === id)
          )
          WsService.sendDataToClientById(userId, {
            type: WsService.SOCKET_EVENTS.GET_ONLINE_USERS,
            payload: onlineUsers
          })
          break
        case WsService.SOCKET_EVENTS.SEND_MESSAGE:
          const { senderId, receiverId, message, createdAt } =
            payload as ISocketEventSendMessage
          const result = await MessageService.createMessage({
            senderId,
            receiverId,
            message,
            createdAt
          })
          WsService.sendDataToClientById(receiverId, {
            type: WsService.SOCKET_EVENTS.HAS_NEW_MESSAGE,
            payload: {
              _id: result._id,
              senderId,
              receiverId,
              message,
              createdAt
            }
          })
          break
      }
    } catch (error: Error | any) {
      LoggerService.error({
        where: 'WsService',
        message: `Error on message: ${error.message}`
      })
    }
  }

  static sendDataToClientById(userId: string, data: any) {
    const client = WsService.clients.get(userId)
    if (!client) return
    client.send(JSON.stringify(data))
  }

  static closeConnection(userId: string) {
    const client = WsService.clients.get(userId)
    client?.close()
    WsService.clients.delete(userId)
  }
}

export default WsService
