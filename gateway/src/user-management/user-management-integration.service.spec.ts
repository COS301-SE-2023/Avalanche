/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Random } from 'mockjs';
import { ConfigService } from '@nestjs/config';

describe('User Management Integration Tests From Gateway', () => {
  describe('User Management Auth Integration From Gateway', () => {
    let app: INestApplication;
    let configService: ConfigService;

    /*
    In order to run most of these tests one neeeds to be logged in
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
    },15000);

    afterAll(async () => {
      await app.close();
    },50000);


    describe('User Login', () => {
      it('should login a user', () => {
        const user = {
          email: configService.get('MOCK_EMAIL'),
          password: configService.get('MOCK_PASSWORD'),
        };
        return request(app.getHttpServer())
          .post('/user-management/login')
          .send(user)
          .expect(201)
          .then((response) => {
            console.log(response.body);
            expect(response.body.status).toBe('success');
          });
      }, 15000);
    });
  });

  describe('User Management Organisation Management Integration From Gateway', () => {
    let app: INestApplication;
    let configService: ConfigService;
    let accessToken: string;

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
    },15000);

    afterAll(async () => {
      await app.close();
    },15000);

    beforeEach(async () => {
      const user = {
        email: configService.get('MOCK_EMAIL'),
        password: configService.get('MOCK_PASSWORD'),
      };
      const response = await request(app.getHttpServer())
        .post('/user-management/login')
        .send(user);
      console.log(response.body.userWithToken);
      if(response.body.userWithToken?.token){
        accessToken = response.body.userWithToken.token;
      }
 // This may change based on the structure of your response
    },15000);

    let orgName: string;
    describe('Create Organisation', () => {
      
      it('should create a new organisation', () => {
        orgName = Random.word(8);
        const organisationDto = {
          name: orgName,
        };
        return request(app.getHttpServer())
          .post('/user-management/createOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationDto)
          .expect(201)
          .then((response) => {
            console.log(response.body);
            expect(response.body.status).toBe('success');
          });
      },15000);

      afterEach(async () => {
        const organisationData = {
          organisationName: orgName,
        };
        return request(app.getHttpServer())
          .post('/user-management/exitOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
      },15000);
    });

    describe('Exit Organisation', () => {
      it('should allow the user to exit  the organisation', () => {
        const organisationData = {
          organisationName: orgName,
        };
        return request(app.getHttpServer())
          .post('/user-management/exitOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData)
          .expect(201)
          .then((response) => {
            console.log(response.body);
            expect(response.body.status).toBe('success');
          });
      },15000);

      it('should not allow a user to exit a random Organisation that does not exist', () => {
        const organisationData = {
          organisationName: `Non-existent_Organisation`,
        };
        return request(app.getHttpServer())
          .post('/user-management/exitOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData)
          .expect(400)
          .then((response) => {
            console.log(response.body);
            expect(response.body.message).toBe('Organisation cannot be found');
          });
      },15000);
    });

    describe('Get User Info', () => {
      it('should get user info', () => {
        return request(app.getHttpServer())
          .post('/user-management/getUserInfo')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(201)
          .then((response) => {
            console.log(response.body);
            expect(response.body.status).toBe('success');
          });
      },15000);

      it('should not get user info if token is invalid', () => {
        return request(app.getHttpServer())
          .post('/user-management/getUserInfo')
          .set('Authorization', 'Bearer invalid_token')
          .expect(401)
          .then((response) => {
            console.log(response.body);
            expect(response.body.message).toBe('JWT invalid');
          });
      },15000);
    });

    describe('Get Members', () => {
      it('should get members', () => {
        return request(app.getHttpServer())
          .post('/user-management/getMembers')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(201)
          .then((response) => {
            console.log(response.body);
            expect(response.body.status).toBe('success');
          });
      },15000);

      it('should not get members if token is invalid', () => {
        return request(app.getHttpServer())
          .post('/user-management/getMembers')
          .set('Authorization', 'Bearer invalid_token')
          .expect(401)
          .then((response) => {
            console.log(response.body);
            expect(response.body.message).toBe('JWT invalid');
          });
      },15000);
    });

    describe('Create User Group', () => {
      let orgName;

      beforeEach(async () => {
        orgName = Random.word(8);
        const organisationData = {
          name: orgName,
        };
        return request(app.getHttpServer())
          .post('/user-management/createOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
      },15000);
      it('should create a user group', () => {
        const groupData = Random.word(8);
        const userGroupData = {
          name: groupData,
          permission: 1,
        };
        return request(app.getHttpServer())
          .post('/user-management/createUserGroup')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(userGroupData)
          .expect(201)
          .then((response) => {
            expect(response.body.status).toBe('success');
          });
      }, 15000);

      afterEach(async () => {
        const organisationData = {
          organisationName: orgName,
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
        };
        return request(app.getHttpServer())
          .post('/user-management/createUserGroup')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(userGroupData);
      },15000);
      it('should add user to user group', () => {
        const userGroupData = {
          userEmail: configService.get('MOCK_EMAIL'),
          userGroupName: groupName,
        };
        return request(app.getHttpServer())
          .post('/user-management/addUserToUserGroup')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(userGroupData)
          .expect(201)
          .then((response) => {
            expect(response.body.status).toBe('success');
          });
      }, 15000);

      afterEach(async () => {
        const organisationData = {
          organisationName: orgName,
        };
        return request(app.getHttpServer())
          .post('/user-management/exitOrganisation')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(organisationData);
      },15000);
    });
  });
});
