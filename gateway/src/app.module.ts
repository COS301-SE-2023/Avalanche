/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserManagementService } from './user-management/user-management.service';
import { UserManagementController } from './user-management/user-mangement.controller';
import { JwtMiddleware } from './jwt-middleware.middleware';
import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { ConfigModule } from '@nestjs/config';
import { ZacrController } from './zacr/zacr.controller';
import { ZacrService } from './zacr/zacr.service';
import { DomainWatchController } from './domain-watch/domain-watch.controller';
import { DomainWatchService } from './domain-watch/domain-watch.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'USER_MANAGEMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
      {
        name: 'ZACR_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4002,
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UserManagementController, ZacrController, DomainWatchController],
  providers: [UserManagementService, ZacrService, RedisProvider, DomainWatchService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'user-management/register', method: RequestMethod.POST },
        { path: 'user-management/verify', method: RequestMethod.POST },
        { path: 'user-management/login', method: RequestMethod.POST },
        { path: 'user-management/resendOTP', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
