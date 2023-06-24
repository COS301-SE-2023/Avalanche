import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Random } from 'mockjs';

describe('User Management Integration From Gateway', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', () => {
    const userEmail = Random.email();
    const userPassword = Random.word(8);
    const fName = Random.word(8);
    const lName = Random.word(8);
    const userDto = {
      email: userEmail,
      password: userPassword,
      firstName: fName,
      lastName: lName,
    };

    return request(app.getHttpServer())
      .post('/user-management/register')
      .send(userDto)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toBe(
          'Registration successful. Please check your email for the OTP.',
        );
        expect(response.body.status).toBe('success');
      });
  }, 30000);
});
