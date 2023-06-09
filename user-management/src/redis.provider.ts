/* eslint-disable prettier/prettier */
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
    provide: 'REDIS',
    useFactory: (configService: ConfigService): Redis => {
      const redisPort = configService.get<number>('REDIS_PORT');
      if (!redisPort) {
        throw new Error('Environment variable REDIS_PORT not found');
      }
      return new Redis({
        host: configService.get('REDIS_HOST'),
        port: redisPort,
        username: configService.get('REDIS_USER'),
        password: configService.get('REDIS_PASSWORD'),
      });
    },
    inject: [ConfigService], // <-- don't forget to inject ConfigService
};