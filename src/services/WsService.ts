import { Server } from 'ws';
import { validateTokenWS } from './../core/JWT';
interface CustomWebSocket extends Server {
  clientId: string;
  username: string;
}
class WsService {
  static socket: CustomWebSocket;
  static clients: any = {};

  static onConnection(socket: any): void {
    WsService.socket = socket;
    WsService.socket.on('message', WsService._onMessage);
    WsService.socket.on('error', (err: any) => {
      console.error('Socket error', err);
    });
  }

  static _onMessage(message: string): void {
    const observers = Object.keys(WsService.clients);
    console.log('observers', observers, Math.floor(Math.random() * 1000000));
    const { accessToken, data } = JSON.parse(message);
    if (!accessToken) return;
    const user = validateTokenWS('ACCESS', accessToken) as {
      id: string;
      username: string;
    };
    const { type } = data;
    switch (type) {
      case 'INIT':
        console.log('INIT', user.id);
        // console.log(user.id, user.username, 'connected');
        // @ts-ignore
        WsService.socket.clientId = user.id;
        // @ts-ignore
        WsService.socket.username = user.username;
        WsService.clients[user.id] = { id: user.id, socket: WsService.socket };
        break;
      case 'GET_ONLINE_USERS':
        console.log('GET_ONLINE_USERS', user.id);
        WsService.sendDataToClientById({
          id: user.id,
          data: {
            type: 'ONLINE_USERS',
            payload: observers,
          },
        });
        break;
      case 'CLOSE_CONNECTION':
        const currentSocket = WsService.clients[user.id];
        if (currentSocket) {
          delete WsService.clients[user.id];
          currentSocket.socket.close();
        }
    }
  }

  static sendDataToClientById({ id, data }: sendDataToIdByWs) {
    const client = WsService.clients[id];
    if (!client) return;
    client.socket.send(JSON.stringify(data));
  }
}

export default WsService;
