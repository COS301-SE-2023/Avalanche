/* eslint-disable prettier/prettier */
// redis.module.ts
import { Module, CacheModule, Global } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisUserModule {}
