import { validateTokenWS } from './../core/JWT';
class WsService {
  static authenticate(connection: any, data: { accessToken: string }): void {
    const { accessToken } = data;
    const decode = validateTokenWS('ACCESS', accessToken);
    if (!decode) {
      connection.close();
      return;
    }
    console.log('Client connected');
    connection.decode;
    connection.send("You're account is verified");
  }
}

export default WsService;
