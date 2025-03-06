import { validateTokenWS } from './../core/JWT'
import MessageService from './MessageService'
import FriendService from './FriendService'
import logger from '../core/Logger'
const _logger = logger('WsService')
import { Request } from 'express'
import { SOCKET_EVENTS } from '../events'

class WsService {
  static clients: Map<string, WebSocket> = new Map()

  static onConnection(socket: any, req: Request): void {
    const accessToken = req.url?.split('?')[1].split('accessToken=')[1]
    if (!accessToken) {
      socket.close()
      return
    }
    const data: JWT_PAYLOAD | null = validateTokenWS('ACCESS', accessToken)
    if (!data) {
      socket.close()
      return
    }
    WsService.clients.set(data.id, socket)
    socket.on('message', WsService._onMessage)
    socket.on('error', (err: any) => _logger.error('Socket', err))
  }

  static async _onMessage(message: string): Promise<void> {
    try {
      const clientIds = Object.keys(WsService.clients)
      const { data } = JSON.parse(message)
      const { type, payload } = data
      switch (type) {
        case SOCKET_EVENTS.GET_ONLINE_USERS:
          const userId = payload.userId
          const user = WsService.clients.get(userId)
          if (!user) return
          const friends = await FriendService.getMyFriends(userId)
          const onlineUsers = clientIds.filter((id: string) =>
            friends?.some((friend: any) => friend._id.toString() === id)
          )
          WsService.sendDataToClientById(userId, {
            type: SOCKET_EVENTS.GET_ONLINE_USERS,
            payload: onlineUsers
          })
          break
        case SOCKET_EVENTS.SEND_MESSAGE:
          const { _id, senderId, receiverId, message, createdAt } = payload
          await MessageService.createMessage({
            senderId,
            receiverId,
            message,
            createdAt
          })
          WsService.sendDataToClientById(receiverId, {
            type: SOCKET_EVENTS.HAS_NEW_MESSAGE,
            payload: {
              _id,
              senderId,
              receiverId,
              message,
              createdAt
            }
          })
          break
      }
    } catch (error: Error | any) {
      _logger.error('error.message', error.message)
    }
  }

  static sendDataToClientById(userId: string, data: sendDataToIdByWs) {
    const client = WsService.clients.get(userId)
    client?.send(JSON.stringify(data))
  }
}

export default WsService
