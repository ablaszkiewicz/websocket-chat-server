import { Module } from '@nestjs/common';
import { AppGateway } from './websocket/app.gateway';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
