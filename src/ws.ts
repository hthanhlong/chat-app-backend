import ws from 'ws'
import WsService from './core/services/WsService'
import { Request } from 'express'

const wss = new ws.WebSocketServer({ port: 8081 })
wss.on('connection', (socket, req: Request) =>
  WsService.onConnection(socket, req)
)
