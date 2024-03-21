import { validateTokenWS } from './../core/JWT';
class WsService {
  static socket: WebSocket | null = null;

  static onConnection(socket: any): void {
    WsService.socket = socket;
    socket.on('message', WsService._onMessage);
    socket.on('close', WsService._onClose);
  }

  static _onMessage(message: string): void {
    const { accessToken, type, data } = JSON.parse(message);
    if (!accessToken) {
      console.log('accessToken not found');
      WsService?.socket?.close();
    }
    const user = validateTokenWS('ACCESS', accessToken);
    switch (type) {
      case 'INIT':
        console.log('user', user, type, data);
        break;
      default:
        break;
    }
  }

  static _onClose(): void {
    WsService.sendData('client actively close successfully');
  }

  static sendData(data: string) {
    WsService.socket?.send(data);
  }
}

export default WsService;
