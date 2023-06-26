import { Test, TestingModule } from '@nestjs/testing';
import { JwtMiddleware } from './jwt-middleware.middleware';
import * as redis from 'ioredis';

describe('JwtMiddleware', () => {
  let middleware: JwtMiddleware;
  let redisMock: jest.Mocked<redis.Redis>;

  beforeEach(async () => {
    redisMock = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtMiddleware,
        {
          provide: 'REDIS',
          useValue: redisMock,
        },
      ],
    }).compile();

    middleware = module.get<JwtMiddleware>(JwtMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should handle valid token with zacr', async () => {
    const nextMock = jest.fn();
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const reqMock = {
      headers: {
        authorization: 'Bearer mytoken',
      },
      baseUrl: '/zacr',
      body: {
        graphName: 'mygraph',
      },
    };

    redisMock.get.mockResolvedValue(JSON.stringify({ userId: 'user1' }));

    await middleware.use(reqMock as any, resMock as any, nextMock);

    expect(redisMock.get).toHaveBeenCalledWith('mytoken');
    expect(nextMock).toHaveBeenCalled();
    expect(resMock.status).not.toHaveBeenCalled();
  });

  it('should handle valid token with domain watch', async () => {
    const nextMock = jest.fn();
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const reqMock = {
      headers: {
        authorization: 'Bearer mytoken',
      },
      baseUrl: '/domain-watch',
      body: {
        string: 'mystring',
      },
    };

    redisMock.get.mockResolvedValue(JSON.stringify({ userId: 'user1' }));

    await middleware.use(reqMock as any, resMock as any, nextMock);

    expect(redisMock.get).toHaveBeenCalledWith('mytoken');
    expect(nextMock).toHaveBeenCalled();
    expect(resMock.status).not.toHaveBeenCalled();
  });

  it('should handle valid token with empty', async () => {
    const nextMock = jest.fn();
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const reqMock = {
      headers: {
        authorization: 'Bearer mytoken',
      },
      baseUrl: '',
      body: {
        string: 'mystring',
      },
    };

    redisMock.get.mockResolvedValue(JSON.stringify({ userId: 'user1' }));

    await middleware.use(reqMock as any, resMock as any, nextMock);

    expect(redisMock.get).toHaveBeenCalledWith('mytoken');
    expect(nextMock).toHaveBeenCalled();
    expect(resMock.status).not.toHaveBeenCalled();
  });

  it('should handle invalid token', async () => {
    const nextMock = jest.fn();
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const reqMock = {
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    };

    redisMock.get.mockResolvedValue(null);

    await middleware.use(reqMock as any, resMock as any, nextMock);

    expect(redisMock.get).toHaveBeenCalledWith('invalidtoken');
    expect(nextMock).not.toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.json).toHaveBeenCalled();
  });

  it('should handle invalid token', async () => {
    const nextMock = jest.fn();
    const resMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const reqMock = {
      headers: {
        authorization: 'Bearer_invalidtoken',
      },
    };

    redisMock.get.mockResolvedValue(null);

    await middleware.use(reqMock as any, resMock as any, nextMock);

    expect(nextMock).not.toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(401);
    expect(resMock.json).toHaveBeenCalled();
  });
});
