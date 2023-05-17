/* eslint-disable prettier/prettier */
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProvider = {
    provide: 'REDIS',
    useFactory: (): Redis => {
      return new Redis({
        host: 'redis-10788.c261.us-east-1-4.ec2.cloud.redislabs.com',
        port: 10788,
        username: 'default',
        password: 'ueI96GshZ9CiqZ6Xu4cZJtcl48gHx5nb',
      });
    },
  };
  
