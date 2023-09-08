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
import { ScheduleModule } from '@nestjs/schedule';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    ClientsModule.register([
      {
        name: 'USER_MANAGEMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.UM_HOST || 'localhost',
          port: 4001,
        },
      },
      {
        name: 'ZACR_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ZACR_HOST || 'localhost',
          port: 4002,
        },
      },
      {
        name: 'RyCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.RYCE_HOST || 'localhost',
          port: 4004,
        },
      },
      {
        name: 'AFRICA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AFRICA_HOST || 'localhost',
          port: 4005,
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [MetricsController,UserManagementController, ZacrController, RyceController, AfricaController, DomainWatchController],
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
        { path: 'domain-watch/list', method: RequestMethod.POST },
        { path: 'domain-watch/passive', method: RequestMethod.GET },
        { path: 'domain-watch/loadDomains', method: RequestMethod.GET },
        { path: 'domain-watch/whoisyou', method: RequestMethod.POST },
        { path: 'user-management/graphFilters', method: RequestMethod.GET },
        { path: 'user-management/getDomainWatchPassive', method: RequestMethod.POST },
        { path: 'africa/domainWatchPassive', method: RequestMethod.POST },
        { path: 'ryce/domainWatchPassive', method: RequestMethod.POST },
        { path: 'metrics', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}