/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Random } from 'mockjs';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

describe('RyCE Service Integration Tests From Gateway', () => {
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
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('should perform transactions for a granularity of a month', () => {
      const data = {
        zone : ["WIEN"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month"
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/ryce/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions for a granularity of a year', () => {
      const data = {
        zone : ["WIEN"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Yearly, from ${dateFrom} to ${dateTo}`, granularity: "year"
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/ryce/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  // Similar tests for the other endpoints
  
  describe('Domain Watch Passive', () => {
    it('should perform domain watch passively', () => {
      const data = {}; // Replace this with actual data

      return request(app.getHttpServer())
        .post('/africa/domainWatchPassive')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(201)
        .then((response) => {
          console.log(response.body);
          expect(response.body);
        });
    }, 100000);
  });
});
