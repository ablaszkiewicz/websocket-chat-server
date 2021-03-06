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
import { File } from 'src/file.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
    transports: ['websocket', 'polling'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  allowEIO3: true,
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

  @SubscribeMessage('fileMetaToServer')
  handleFileMeta(client: Socket, file: File): void {
    this.server.emit('fileMetaToClient', file);
  }

  @SubscribeMessage('filePartToServer')
  handleFilePart(client: Socket, file: File): void {
    this.server.emit('filePartToClient', file);
  }

  @SubscribeMessage('requestKeyToServer')
  async handleRequestKey(client: Socket, publicKey: string): Promise<string> {
    const connectedClients = await this.server.fetchSockets();
    const target = connectedClients.find((c) => c.id != client.id);

    if (!target) {
      return '';
    } else {
      return this.getKeyFromClient(target, publicKey);
    }
  }

  async getKeyFromClient(client: any, publicKey: string): Promise<string> {
    return new Promise((resolve) => {
      client.emit('requestKeyToClient', publicKey, (keyObject: string) => {
        resolve((keyObject as any).cipher);
      });
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.query.token as string;

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
