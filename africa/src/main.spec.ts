import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => {
  return {
    NestFactory: {
      createMicroservice: jest.fn().mockResolvedValue({
        listen: jest.fn(),
      }),
    },
  };
});

describe('main', () => {
  it('should bootstrap the application', async () => {
    require('./main');

    expect(NestFactory.createMicroservice).toHaveBeenCalledWith(AppModule, {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST || "localhost",
        port: 4005,
      },
    });
  });
});
