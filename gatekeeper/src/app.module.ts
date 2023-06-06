/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ForwardService } from './forward.service';
import { HttpModule } from '@nestjs/axios';
import { ValidateRequestMiddleware } from './middleware/validate-request.middleware';
import rateLimit from 'express-rate-limit';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [ForwardService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateRequestMiddleware,
        rateLimit({
          windowMs: 60 * 1000, // 1 minute
          max: 100, // limit each IP to 100 requests per windowMs
          message: "{'error : Too many requests, please try again later.'}",
        })) 
      .forRoutes('*');
  }
}
