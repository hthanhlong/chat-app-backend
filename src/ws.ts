import ws from 'ws'
import WsService from './core/services/WsService'
import { IRequest } from './types'
import envConfig from './config'

class WebSocketService {
  private wss!: ws.Server

  init = () => {
    this.wss = new ws.Server({ port: Number(envConfig.SOCKET_PORT) })
    this.wss.on('connection', (socket: ws.WebSocket, req: IRequest) =>
      WsService.onConnection(socket, req)
    )
  }
}

export default new WebSocketService()
