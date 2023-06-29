import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';
import { Test } from '@nestjs/testing';
import { RedisProvider } from './redis.provider';

jest.mock('ioredis', () => {
  class MockRedis {}
  return { default: jest.fn().mockImplementation(() => new MockRedis()) };
});

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key) => {
      switch (key) {
        case 'REDIS_PORT':
          return 6379;
        case 'REDIS_HOST':
          return 'localhost';
        case 'REDIS_USER':
          return 'testUser';
        case 'REDIS_PASSWORD':
          return 'testPassword';
        default:
          return null;
      }
    }),
  })),
}));

describe('RedisProvider', () => {
  let redisInstance: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RedisProvider, ConfigService],
    }).compile();

    redisInstance = moduleRef.get<Redis.default>('REDIS');
  });

  it('should be defined', () => {
    expect(redisInstance).toBeDefined();
    expect(Redis.default).toBeCalledWith({
      host: 'localhost',
      port: 6379,
      username: 'testUser',
      password: 'testPassword',
    });
  });
});
