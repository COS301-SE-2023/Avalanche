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
  //console.log(accessToken);


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
        zone : ["CO.ZA"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", token : `Bearer ${accessToken}`
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/zacr/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          ////console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions for a granularity of a year', () => {
      const data = {
        zone : ["CO.ZA"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Yearly, from ${dateFrom} to ${dateTo}`, granularity: "year", token : `Bearer ${accessToken}`
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/zacr/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          ////console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Transactions by registrar integration tests', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('should perform transactions for a granularity of a month for registrar hetzner', () => {
      const data = {
        zone : ["CO.ZA"],registrar: ["afrihost"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", token : `Bearer ${accessToken}`
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/zacr/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions for a granularity of a month for registrar diamatrix', () => {
      const data = {
        zone : ["CO.ZA"], registrar: ["afrihost"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Monthly, from ${dateFrom} to ${dateTo}`, granularity: "month", token : `Bearer ${accessToken}`
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/zacr/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions for a granularity of a year for registrar hetzner', () => {
      const data = {
        token : `Bearer ${accessToken}`,zone : ["CO.ZA"], dateFrom : dateFrom, dateTo: dateTo, graphName: `Yearly, from ${dateFrom} to ${dateTo}`, granularity: "year"
      }; // Replace this with actual data
      
      return request(app.getHttpServer())
        .post('/zacr/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Transactions ranking by registrar', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('should perform transactions ranking for renew', () => {
      const data = { token : `Bearer ${accessToken}`,graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['CO.ZA'], registrar: ["hetzner", "diamatrix", "afrihost"], transactions: ["renew"] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/transactions-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions ranking for create', () => {
      const data = { token : `Bearer ${accessToken}`,graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['CO.ZA'], registrar: ["hetzner", "diamatrix", "afrihost"], transactions: ["create"] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/transactions-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('should perform transactions ranking for transfer', () => {
      const data = { token : `Bearer ${accessToken}`,graphName: `Monthly renew ranking, from ${dateFrom} to ${dateTo}`, granularity: "month", dateFrom, dateTo, zone: ['CO.ZA'], registrar: ["hetzner", "diamatrix", "afrihost"], transactions: ["transfer"] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/transactions-ranking')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Marketshare', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('top5', () => {
      const data = { token : `Bearer ${accessToken}`,rank : 'top5' } ;
      
      return request(app.getHttpServer())
        .post('/zacr/marketShare')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top10', () => {
      const data = { token : `Bearer ${accessToken}`,rank : 'top10' } ;
      
      return request(app.getHttpServer())
        .post('/zacr/marketShare')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top20', () => {
      const data = { token : `Bearer ${accessToken}`,rank : 'top20' } ;
      
      return request(app.getHttpServer())
        .post('/zacr/marketShare')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Age', () => {
    const currentDate = new Date();
    const dateFrom = `${currentDate.getFullYear()-1}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const dateTo = `${currentDate.getFullYear()}-${(currentDate.getMonth()).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;;
    it('top5 Average Age', () => {
      const data = { token : `Bearer ${accessToken}`,rank: 'top5', average: true, overall: false, zone: ['CO.ZA'] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/age')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top5', () => {
      const data = { token : `Bearer ${accessToken}`,rank: 'top5', average: true, overall: false, zone: ['CO.ZA'] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/age')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('top10 Average Age', () => {
      const data = { token : `Bearer ${accessToken}`,rank: 'top5', average: true, overall: false, zone: ['CO.ZA'] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/age')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Movement Vertical', () => {
    it('empty data test', () => {
      const data = { token : `Bearer ${accessToken}` } ;
      
      return request(app.getHttpServer())
        .post('/zacr/domainNameAnalysis/length')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('dateFrom test', () => {
      const data = {token : `Bearer ${accessToken}`, dateFrom: "2022-05-08" } ;
      
      return request(app.getHttpServer())
        .post('/zacr/domainNameAnalysis/length')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('dateFrom test 2', () => {
      const data = {token : `Bearer ${accessToken}`, dateFrom: "2021-05-08" } ;
      
      return request(app.getHttpServer())
        .post('/zacr/domainNameAnalysis/length')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });

  describe('Movement Vertical', () => {
    it('empty data test', () => {
      const data = {token : `Bearer ${accessToken}`, zone: ["CO.ZA"] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/movement/vertical')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('Movement Vertical with three registrars', () => {
      const data = {token : `Bearer ${accessToken}`, zone: ["CO.ZA"], registrar: ["hetzner", "diamatrix", "afrihost"] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/movement/vertical')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);

    it('Movement Vertical with one registrar', () => {
      const data = {token : `Bearer ${accessToken}`, zone: ["CO.ZA"], registrar: ["afrihost"] } ;
      
      return request(app.getHttpServer())
        .post('/zacr/movement/vertical')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .then((response) => {
          //console.log(response.body);
          expect(response.body.status).toBe('success');
        });
    }, 100000);
  });
  
  describe('Domain Watch Passive', () => {
    it('should perform domain watch passively', () => {
      const data = {token : `Bearer ${accessToken}`}; // Replace this with actual data

      return request(app.getHttpServer())
        .post('/zacr/domainWatchPassive')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(200) // Update status code based on your expectation
        .then((response) => {
          //console.log(response.body);
        });
    });
  });
});
