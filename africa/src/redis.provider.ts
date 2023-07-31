/* eslint-disable prettier/prettier */
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
  provide: 'REDIS',
  useFactory: (configService: ConfigService): Redis => {
    const redisPort = configService.get<number>('REDIS_PORT');
    if (!redisPort) {
      throw new Error('Environment variable REDIS_PORT not found');
    }

    let redisConfig = {
      host: configService.get('REDIS_HOST'),
      port: redisPort,
    }

    if (configService.get('REDIS_USER')) {
      redisConfig["username"] = configService.get('REDIS_USER');
    }

    if (configService.get('REDIS_PASSWORD')) {
      redisConfig["password"] = configService.get('REDIS_PASSWORD');
    }

    return new Redis(redisConfig);

  },
  inject: [ConfigService], // <-- don't forget to inject ConfigService
};