import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserManagementService } from './user-management/user-management.service';
import { UserManagementController } from './user-management/user-mangement.controller';
import { JwtMiddleware } from './jwt-middleware.middleware';
import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_MANAGEMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService, RedisProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'user-management/register', method: RequestMethod.POST },
        { path: 'user-management/verify', method: RequestMethod.POST },
        { path: 'user-management/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
