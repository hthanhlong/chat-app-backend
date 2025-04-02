import { WebSocketServer, Server as WsServer } from 'ws'
import WsService from './core/services/WsService'
import envConfig from './config'
import LoggerService from './core/services/LoggerService'
import { Request } from 'express'

class WebSocketService {
  private wss!: WsServer

  init() {
    this.wss = new WsServer({ port: Number(envConfig.SOCKET_PORT) })
    this.wss.on('listening', () => {
      LoggerService.info({
        where: 'ws',
        message: `WebSocket server is running on port ${envConfig.SOCKET_PORT}`
      })
    })
    this.wss.on('connection', (socket: WsServer, req: Request) => {
      const url = req.url
      if (url?.startsWith('/ws')) {
        WsService.onConnection(socket, req)
      } else {
        socket.close()
      }
    })
  }
}

export default new WebSocketService()
