/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Random } from 'mockjs';
import { ConfigService } from '@nestjs/config';

describe('ZACR Service Integration Tests From Gateway', () => {
  let app: INestApplication;
  let configService: ConfigService;
  const accessToken = process.env.JWT_TOKEN_TO_TEST;
  console.log(accessToken);


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    configService = moduleFixture.get<ConfigService>(ConfigService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  describe('Transactions', () => {
    it('should perform transactions', () => {
      const data = {
        zone : ["CO.ZA"]
      }; // Replace this with actual data

      return request(app.getHttpServer())
        .post('/zacr/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(200) // Update status code based on your expectation
        .then((response) => {
          // Add actual expectations
        });
    });
  });

  // Similar tests for the other endpoints
  
  describe('Domain Watch Passive', () => {
    it('should perform domain watch passively', () => {
      const data = {}; // Replace this with actual data

      return request(app.getHttpServer())
        .post('/zacr/domainWatchPassive')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(200) // Update status code based on your expectation
        .then((response) => {
          // Add actual expectations
        });
    });
  });
});
