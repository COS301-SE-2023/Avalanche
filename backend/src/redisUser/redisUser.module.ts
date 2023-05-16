/* eslint-disable prettier/prettier */
// redis.module.ts
import { Module, CacheModule, Global, CacheModuleOptions } from '@nestjs/common';
import redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => ({
        store: 'redis',
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisUserModule { }
