import ws from 'ws';
import WsService from './services/WsService';

const wss = new ws.WebSocketServer({
  port: 8081,
});

wss.on('connection', WsService.onConnection);
