import { validateTokenWS } from './../core/JWT';
class WsService {
  static socket: WebSocket | null = null;
  static clients: any = {};

  static onConnection(socket: any): void {
    WsService.socket = socket;
    socket.on('message', WsService._onMessage);
    socket.on('close', WsService._onClose);
    socket.on('error', (err: any) => {
      console.error('Socket error', err);
    });
  }

  static _onMessage(message: string): void {
    // console.log('======>');
    const { accessToken, data } = JSON.parse(message);
    if (!accessToken) return;
    const user = validateTokenWS('ACCESS', accessToken) as {
      id: string;
      username: string;
    };
    const { type } = data;
    switch (type) {
      case 'INIT':
        // console.log(user.id, user.username, 'connected');
        // @ts-ignore
        WsService.socket.clientId = user.id;
        // @ts-ignore
        WsService.socket.username = user.username;
        WsService.clients[user.id] = { id: user.id, socket: WsService.socket };
        break;
      default:
        break;
    }
  }

  static _onClose(): void {
    // get close from client
    // @ts-ignore
    const { clientId } = WsService.socket;
    if (clientId) {
      // console.log(clientId, username, 'disconnected');
      delete WsService.clients[clientId];
      if (WsService.socket) {
        WsService.socket.close();
      }
    }
  }

  static sendDataToClientById({ id, data }: sendDataToIdByWs) {
    const client = WsService.clients[id];
    if (!client) return;
    // console.log('client.id', client.id);
    client.socket.send(JSON.stringify(data));
  }
}

export default WsService;
