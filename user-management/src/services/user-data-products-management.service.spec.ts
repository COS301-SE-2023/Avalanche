/* eslint-disable prettier/prettier */

import { User } from '../entity/user.entity';
import { UserGroup } from '../entity/userGroup.entity';
import { Organisation } from '../entity/organisation.entity';
import { Repository } from "typeorm";
import { UserDataProductMangementService } from "./user-data-products-management.service";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('UserDataProductMangementService', () => {
    let userDataProductMangementService: UserDataProductMangementService; //service we are testing
    //the belwo are the repos we are going to be using
    let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;
    let mockUserGroupRepository: jest.Mocked<Partial<Repository<UserGroup>>>;
    let mockOrganisationRepository: jest.Mocked<Partial<Repository<Organisation>>>;
    let mockRedis: jest.Mocked<Redis>;

    beforeEach(async () => {
        const userRepository = {
          findOne: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        };
    
        const userGroupRepository = {
          findOne: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        };
    
    
        const organisationRepository = {
          findOne: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        };
    
        const redis = {
          get: jest.fn(),
          set: jest.fn(),
          del: jest.fn(),
        };
    
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UserDataProductMangementService,
            {
              provide: getRepositoryToken(User),
              useValue: userRepository,
            },
            {
              provide: getRepositoryToken(UserGroup),
              useValue: userGroupRepository,
            },
            {
              provide: getRepositoryToken(Organisation),
              useValue: organisationRepository,
            },
            {
              provide: 'REDIS', // Provide the mock redis service
              useValue: redis,
            },
            ConfigService
          ],
        }).compile();
    
        userDataProductMangementService = module.get<UserDataProductMangementService>(UserDataProductMangementService);
        mockUserRepository = module.get(getRepositoryToken(User));
        mockUserGroupRepository = module.get(getRepositoryToken(UserGroup));
        mockOrganisationRepository = module.get(getRepositoryToken(Organisation));
        //UserOrganisationMangementService.prototype.sendRegistrationEmail = mockSendRegistrationEmail;
        //UserOrganisationMangementService.prototype.sendInvitationEmail = mockSendInvitationEmail;
        mockRedis = module.get('REDIS');
      });


      describe('integrateUserWithWExternalAPI',() => {
        
        it('username not entered',async () => {
            //given
            const token = 'token';
            const type = 'type';
            const allocateToName = 'allocateToName';
            const password = 'password';
            const personal = true;
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, null, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Please enter all account details')
        })
        
      })

      describe('integrateWithDataProducts', () => {
        //
        
      })


})