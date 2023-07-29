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


  describe('Transactions integration tests', () => {
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

  describe('Transactions by registrar integration tests', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('should perform transactions for a granularity of a month for registrar 1und1', () => {
      const data = {
        zone : ["WIEN"],registrar: ["1und1"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month"
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

    it('should perform transactions for a granularity of a month for registrar registrygate', () => {
      const data = {
        zone : ["WIEN"], registrar: ["registrygate"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month"
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

    it('should perform transactions for a granularity of a year for registrar 1und1', () => {
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

  describe('Transactions ranking by registrar', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('should perform transactions ranking for renew', () => {
      const data = { graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['WIEN'], registrar: ["1und1", "registrygate", "internetx"], transactions: ["renew"] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/transactions-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions ranking for create', () => {
      const data = { graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['WIEN'], registrar: ["1und1", "registrygate", "internetx"], transactions: ["create"] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/transactions-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions ranking for transfer', () => {
      const data = { graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['WIEN'], registrar: ["1und1", "registrygate", "internetx"], transactions: ["transfer"] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/transactions-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Marketshare', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('top5', () => {
      const data = { rank : 'top5' } ;
      
      return request(app.getHttpServer())
        .post('/ryce/marketShare')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top10', () => {
      const data = { rank : 'top10' } ;
      
      return request(app.getHttpServer())
        .post('/ryce/marketShare')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top20', () => {
      const data = { rank : 'top20' } ;
      
      return request(app.getHttpServer())
        .post('/ryce/marketShare')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Age', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('top5 Average Age', () => {
      const data = { rank: 'top5', average: true, overall: false, zone: ['WIEN'] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/age')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top5', () => {
      const data = { rank: 'top5', average: true, overall: false, zone: ['WIEN'] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/age')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top10 Average Age', () => {
      const data = { rank: 'top5', average: true, overall: false, zone: ['WIEN'] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/age')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Movement Vertical', () => {
    it('empty data test', () => {
      const data = {  } ;
      
      return request(app.getHttpServer())
        .post('/ryce/domainNameAnalysis/length')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('dateFrom test', () => {
      const data = { dateFrom: "2022-05-08" } ;
      
      return request(app.getHttpServer())
        .post('/ryce/domainNameAnalysis/length')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('dateFrom test 2', () => {
      const data = { dateFrom: "2021-05-08" } ;
      
      return request(app.getHttpServer())
        .post('/ryce/domainNameAnalysis/length')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Movement Vertical', () => {
    it('empty data test', () => {
      const data = { zone: ["WIEN"] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/movement/vertical')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('Movement Vertical with three registrars', () => {
      const data = { zone: ["WIEN"], registrar: ["1und1", "registrygate", "internetx"] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/movement/vertical')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('Movement Vertical with one registrar', () => {
      const data = { zone: ["WIEN"], registrar: ["internetx"] } ;
      
      return request(app.getHttpServer())
        .post('/ryce/movement/vertical')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });
});
