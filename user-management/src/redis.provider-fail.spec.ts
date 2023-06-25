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
  it('should throw error when REDIS_PORT is not defined', async () => {
    await expect(
      Test.createTestingModule({
        providers: [RedisProvider, ConfigService],
      }).compile(),
    ).rejects.toThrow('Environment variable REDIS_PORT not found');
  });
});
