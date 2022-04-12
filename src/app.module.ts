import { Module } from '@nestjs/common';
import { AppGateway } from './websocket/app.gateway';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '7d' },
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
