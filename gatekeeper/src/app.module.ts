/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ForwardService } from './forward.service';
import { HttpModule } from '@nestjs/axios';
import { ValidateRequestMiddleware } from './middleware/validate-request.middleware';
import { DynamicRateLimitMiddleware } from './middleware/rate.middleware';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController,MetricsController],
  providers: [ForwardService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateRequestMiddleware,DynamicRateLimitMiddleware)
      .exclude({ path: 'metrics', method: RequestMethod.GET })
        // rateLimit({
        //   windowMs: 60 * 1000,
        //   max: 100, 
        //   message: "{'error : Too many requests, please try again later.'}",
        // })) 
      .forRoutes('*');
  }
}
