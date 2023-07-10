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
import { RyceController } from './ryce/ryce.controller';
import { RyceService } from './ryce/ryce.service';
import { AfricaController } from './africa/africa.controller';
import { AfricaService } from './africa/africa.service';

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
      {
        name: 'RyCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4004,
        },
      },
      {
        name: 'AFRICA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4005,
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UserManagementController, ZacrController, RyceController, AfricaController, DomainWatchController],
  providers: [UserManagementService, ZacrService, RyceService, AfricaService, RedisProvider, DomainWatchService],
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
        { path: 'domain-watch/list', method: RequestMethod.POST }
      )
      .forRoutes('*');
  }
}
