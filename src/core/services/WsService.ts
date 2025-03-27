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
      WsService.clients.set(data.id.toString(), socket)
      RedisService.publishClients(
        JSON.stringify({
          type: WsService.SOCKET_EVENTS.GET_ONLINE_USERS,
          payload: {
            userId: data.id
          }
        })
      )
      RedisService.subOnMessage((channel, message) => {
        if (channel === RedisService.CHANNELS.clients_connected) {
          const data = JSON.parse(message)
          const { type, payload } = data
          if (type === WsService.SOCKET_EVENTS.GET_ONLINE_USERS) {
            const { userUuid } = payload as ISocketEventGetOnlineUsers
            if (!WsService.clients.has(userUuid)) {
              WsService.clients.set(userUuid, socket)
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
        WsService.clients.delete(data.id.toString())
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
          const { userUuid } = payload as ISocketEventGetOnlineUsers
          const user = WsService.clients.get(userUuid)
          if (!user) return WsService.closeConnection(userUuid)
          const friends = await FriendShipService.getMyFriendsByUuid(userUuid)
          const onlineUsers = clientIds.filter((id: string) =>
            friends?.some((friend: any) => friend.id === id)
          )
          WsService.sendDataToClientById(userUuid, {
            type: WsService.SOCKET_EVENTS.GET_ONLINE_USERS,
            payload: onlineUsers
          })
          break
        case WsService.SOCKET_EVENTS.SEND_MESSAGE:
          const { senderId, receiverUuid, message, createdAt } =
            payload as ISocketEventSendMessage
          const result = await MessageService.createMessage({
            senderId,
            receiverUuid,
            message,
            createdAt
          })
          WsService.sendDataToClientById(receiverUuid, {
            type: WsService.SOCKET_EVENTS.HAS_NEW_MESSAGE,
            payload: {
              id: result.id,
              senderId,
              receiverUuid,
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

  static sendDataToClientById(receiverUuid: string, data: any) {
    const client = WsService.clients.get(receiverUuid)
    if (!client) return
    client.send(JSON.stringify(data))
  }

  static closeConnection(receiverUuid: string) {
    const client = WsService.clients.get(receiverUuid)
    client?.close()
    WsService.clients.delete(receiverUuid)
  }
}

export default WsService
