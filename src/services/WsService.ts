import { validateTokenWS } from './../core/JWT';
class WsService {
  static socket: WebSocket | null = null;
  static clients: any = {};

  static onConnection(socket: any): void {
    WsService.socket = socket;
    socket.on('message', WsService._onMessage);
  }

  static _onMessage(message: string): void {
    const { accessToken, data } = JSON.parse(message);
    if (!accessToken) return WsService?.socket?.close();
    const user = validateTokenWS('ACCESS', accessToken) as {
      id: string;
      username: string;
    };
    const { type } = data;
    switch (type) {
      case 'INIT':
        WsService.clients[user.id] = { id: user.id, socket: WsService.socket };
        break;
      default:
        break;
    }
  }

  static sendDataToClientById({ id, data }: sendDataToIdByWs) {
    const client = WsService.clients[id];
    if (!client) return;
    client.socket.send(JSON.stringify(data));
  }
}

export default WsService;
