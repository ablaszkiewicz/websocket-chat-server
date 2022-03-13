import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Message } from '../message.entity';
import { JwtService } from '@nestjs/jwt';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: Message): void {
    this.server.emit('msgToClient', message);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    const token = client.handshake.headers.authorization;
    this.logger.log(`Client disconnected: ${client.id}`);

    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      client.emit('unauthorized');
      client.disconnect();
    }

    const usernameUppercased =
      decoded.sub.charAt(0).toUpperCase() + decoded.sub.slice(1);
    this.logger.log(`Client connected: ${client.id}`);
    client.broadcast.emit(
      'systemMsgToClient',
      `${usernameUppercased} disconnected`,
    );
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;

    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (e) {
      client.emit('unauthorized');
      client.disconnect();
    }

    const usernameUppercased =
      decoded.sub.charAt(0).toUpperCase() + decoded.sub.slice(1);
    this.logger.log(`Client connected: ${client.id}`);
    client.broadcast.emit(
      'systemMsgToClient',
      `${usernameUppercased} connected`,
    );
  }
}
