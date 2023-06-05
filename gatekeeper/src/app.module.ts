/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ForwardService } from './forward.service';
import { HttpModule } from '@nestjs/axios';
import { ValidateRequestMiddleware } from './middleware/validate-request.middleware';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [ForwardService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateRequestMiddleware) 
      .forRoutes('*');
  }
}
