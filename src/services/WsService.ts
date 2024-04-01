import { Server } from 'ws'
import { validateTokenWS } from './../core/JWT'
import MessageService from './MessageService'
import FriendService from './FriendService'
interface CustomWebSocket extends Server {
  clientId: string
  username: string
}
class WsService {
  static socket: CustomWebSocket
  static clients: any = {}

  static onConnection(socket: any): void {
    WsService.socket = socket
    socket.on('message', WsService._onMessage)
    socket.on('error', (err: any) => console.error('Socket', err))
  }

  static async _onMessage(message: string): Promise<void> {
    try {
      const observers = Object.keys(WsService.clients)
      const { accessToken, data } = JSON.parse(message)
      if (!accessToken) return
      const user = validateTokenWS('ACCESS', accessToken) as {
        id: string
        username: string
      }
      if (!user) return
      const { type, payload } = data
      switch (type) {
        case 'INIT':
          // @ts-ignore
          WsService.socket.clientId = user.id
          // @ts-ignore
          WsService.socket.username = user.username
          WsService.clients[user.id] = { id: user.id, socket: WsService.socket }
          break
        case 'GET_ONLINE_USERS':
          const friends = await FriendService.getMyFriends(user.id)
          const usersOnline = observers.filter((id: string) =>
            friends?.some((friend: any) => friend._id.toString() === id)
          )
          WsService.sendDataToClientById(user.id, {
            type: 'ONLINE_USERS',
            payload: usersOnline
          })
          break
        case 'SEND_MESSAGE':
          const { _id, senderId, receiverId, message, createdAt } = payload
          await MessageService.createMessage({
            senderId,
            receiverId,
            message,
            createdAt
          })
          WsService.sendDataToClientById(receiverId, {
            type: 'HAS_NEW_MESSAGE',
            payload: {
              _id,
              senderId,
              receiverId,
              message,
              createdAt
            }
          })
          break
        case 'CLOSE_CONNECTION':
          const currentSocket = WsService.clients[user.id]
          if (currentSocket) {
            delete WsService.clients[user.id]
            currentSocket.socket.close()
          }
          break
      }
      console.log('observers', observers, Math.floor(Math.random() * 1000000))
    } catch (error: Error | any) {
      console.log('error.message', error.message)
    }
  }

  static sendDataToClientById(socketId: string, data: sendDataToIdByWs) {
    const client = WsService.clients[socketId]
    if (!client) return
    client.socket.send(JSON.stringify(data))
  }
}

export default WsService
