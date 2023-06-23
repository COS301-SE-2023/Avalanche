/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('domain watch controller tests', () => {
    let app: INestApplication;

    beforeEach(async() => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
          }).compile();
      
          app = moduleFixture.createNestApplication();
          await app.init();
    });

    test('/ (Post)', () => {
            expect(app.get("/")).toBe(200)
        })
    
})