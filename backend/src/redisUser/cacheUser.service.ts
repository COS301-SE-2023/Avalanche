/* eslint-disable prettier/prettier */
// redis/cache.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class CacheUserService {
  constructor(
    @InjectRedis() 
    private readonly redisClient: Redis
  ) {}

  async set(key: string, value: any) {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  async get(key: string) {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }
}
