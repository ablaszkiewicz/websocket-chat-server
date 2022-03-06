import { Module } from '@nestjs/common';
import { AppGateway } from './websocket/app.gateway';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
