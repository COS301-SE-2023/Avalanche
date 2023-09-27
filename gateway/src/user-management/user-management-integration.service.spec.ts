/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Random } from 'mockjs';
import { ConfigService } from '@nestjs/config';

describe('User Management Integration Tests From Gateway', () => {

  describe('User Management Organisation Management Integration From Gateway', () => {
    let app: INestApplication;
    let configService: ConfigService;
    let accessToken = process.env.JWT_TOKEN_TO_TEST;

    /*
      In order to run most of these tests one neeeds to be logged in (happens in before each)
      For this purpose use:
          email: configService.get('MOCK_EMAIL')
          password: configService.get('MOCK_PASSWORD')
*/

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      configService = moduleFixture.get<ConfigService>(ConfigService);
      app = moduleFixture.createNestApplication();
      await app.init();
    },20000);

    afterAll(async () => {
      await app.close();
    },20000);


    describe('Get User Info', () => {
      const organisationData = {
        token: `Bearer ${accessToken}12`
      };
      it('should not get user info if token is invalid', () => {
        return request(app.getHttpServer())
          .post('/user-management/getUserInfo')
          .set('Authorization', 'Bearer invalid_token')
          .send(organisationData)
          .expect(401)
          .then((response) => {
            expect(response.body.message).toBe('JWT invalid');
          });
      },20000);
    });

    describe('Get Members', () => {

      it('should not get members if token is invalid', () => {
        return request(app.getHttpServer())
          .post('/user-management/getMembers')
          .set('Authorization', 'Bearer invalid_token')
          .expect(401)
          .then((response) => {
            expect(response.body.message).toBe('JWT invalid');
          });
      },20000);
    });

    describe('Create User Group', () => {
      let orgName;

      beforeEach(async () => {
        orgName = Random.word(8);
        const organisationData = {
          name: orgName,
          token:`Bearer ${accessToken}`
        };
        return request(app.getHttpServer())
          .post('/user-management/createOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
      },20000);
      it('should create a user group', () => {
        const groupData = Random.word(8);
        const userGroupData = {
          name: groupData,
          permission: 1,
          token: `Bearer ${accessToken}`
        };
        return request(app.getHttpServer())
          .post('/user-management/createUserGroup')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(userGroupData)
          .expect(200)
          .then((response) => {
            expect(response.body.status).toBe('success');
          });
      }, 20000);

      afterEach(async () => {
        const organisationData = {
          organisationName: orgName,
          token :`Bearer ${accessToken}`
        };
        return request(app.getHttpServer())
          .post('/user-management/exitOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
      },15000);
    });

    describe('Add User To User Group', () => {
      let orgName;
      let groupName;

      beforeEach(async () => {
        /*
      Create Org
      */
        orgName = Random.word(8);
        const organisationData = {
          name: orgName,
          token : `Bearer ${accessToken}`
        };
        await request(app.getHttpServer())
          .post('/user-management/createOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
        /*
      Create Group
      */
        groupName = Random.word(8);
        const userGroupData = {
          name: groupName,
          permission: 1,
          token : `Bearer ${accessToken}`
        };
        return request(app.getHttpServer())
          .post('/user-management/createUserGroup')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(userGroupData);
      },20000);
      it('should add user to user group', () => {
        const userGroupData = {
          userEmail: configService.get('MOCK_EMAIL'),
          userGroupName: groupName,
          token : `Bearer ${accessToken}`
        };
        return request(app.getHttpServer())
          .post('/user-management/addUserToUserGroup')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(userGroupData)
          .expect(200)
          .then((response) => {
            expect(response.body.status).toBe('success');
          });
      }, 20000);

      afterEach(async () => {
        const organisationData = {
          organisationName: orgName,
          token : `Bearer ${accessToken}`
        };
        return request(app.getHttpServer())
          .post('/user-management/exitOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
      },15000);
    });
  });
});
