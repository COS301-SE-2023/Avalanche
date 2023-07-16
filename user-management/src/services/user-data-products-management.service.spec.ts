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
import { response } from 'express';
import axios, { Axios } from 'axios';
jest.mock('axios');

describe('UserDataProductMangementService', () => {
    let userDataProductMangementService: UserDataProductMangementService; //service we are testing
    //the belwo are the repos we are going to be using
    let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;
    let mockUserGroupRepository: jest.Mocked<Partial<Repository<UserGroup>>>;
    let mockOrganisationRepository: jest.Mocked<Partial<Repository<Organisation>>>;
    let mockRedis: jest.Mocked<Redis>;
    //let mockAxios: jest.Mocked<Axios>;
    
    const mockAxios = axios as jest.Mocked<typeof axios>
    mockAxios.post = jest.fn()

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

        /*const axios = {
            post: jest.fn(),
            get: jest.fn()
        }*/
    
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
            /*{
                provide: 'Axios',
                useValue: axios
            },*/
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
        //mockAxios = module.get('Axios');
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

        it('password not entered',async () => {
            //given
            const token = 'token';
            const type = 'type';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const personal = true;
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, null, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Please enter all account details')
        })

        it('invalid zone given',async () => {
            //given
            const token = 'token';
            const type = 'type';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = true;

            const responsePost = {
                data : {
                    token : "token",
                },
            };

            const responseGet = {
                data : {
                    epp_userName : ""
                }
            }
            mockAxios.post.mockResolvedValue(responsePost);
            mockAxios.get.mockResolvedValue(responseGet);
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Please enter a zone that is from the given choices - AFRICA, RyCE, ZACR')
        })

        it('user does not exist',async () => {
            //given
            const token = 'token';
            const type = 'AFRICA';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = true;

            const responsePost = {
                data : {
                    token : "token",
                },
            };

            const responseGet = {
                data : {
                    epp_userName : ""
                }
            }
            mockAxios.post.mockResolvedValue(responsePost);
            mockAxios.get.mockResolvedValue(responseGet);

            //const user = new User();
            mockUserRepository.findOne.mockResolvedValue(null);
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('User does not exist')
        })


        it('should succeed and user will be integrated with DNS',async () => {
            //given
            const token = 'token';
            const type = 'AFRICA';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = true;

            const responsePost = {
                data : {
                    token : "token",
                },
            };

            const responseGet = {
                data : {
                    epp_userName : ""
                }
            }
            mockAxios.post.mockResolvedValue(responsePost);
            mockAxios.get.mockResolvedValue(responseGet);

            const user = new User();
            mockUserRepository.findOne.mockResolvedValue(user);
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe('success');
            expect(result.message).toBe('User is integrated with DNS')
        })

        it('invalid token',async () => {
            //given
            const token = 'token';
            const type = 'AFRICA';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = false;
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Invalid token')
        })

        it('invalid zone #2',async () => {
            //given
            const token = 'token'
            const type = 'type';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = false;
            const userGroup = new UserGroup();
            userGroup.permission = 1
            const userDetails = {
                userGroups : [
                    userGroup
                ]
            }

            const responsePost = {
                data : {
                    token : "token",
                },
            };
        
            const responseGet = {
                data : {
                    epp_userName : ""
                }
            }
            mockAxios.post.mockResolvedValue(responsePost);
            mockAxios.get.mockResolvedValue(responseGet);
            mockRedis.get.mockResolvedValue(JSON.stringify(userDetails));
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Please enter a zone that is from the given choices - AFRICA, RyCE, ZACR')
        })

        it('cannot find user group with given name',async () => {
            //given
            const token = 'token'
            const type = 'AFRICA';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = false;
            const userGroup = new UserGroup();
            userGroup.permission = 1
            const userDetails = {
                userGroups : [
                    userGroup
                ]
            }

            const responsePost = {
                data : {
                    token : "token",
                },
            };
            const responseGet = {
                data : {
                    epp_userName : ""
                }
            }

            mockAxios.post.mockResolvedValue(responsePost);
            mockAxios.get.mockResolvedValue(responseGet);
            mockRedis.get.mockResolvedValue(JSON.stringify(userDetails));
            mockUserGroupRepository.findOne.mockResolvedValue(null);
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Cannot find user group with the given name')
        })

        it('succeed, user is integrated with DNS',async () => {
            //given
            const token = 'token'
            const type = 'AFRICA';
            const allocateToName = 'allocateToName';
            const username = 'username';
            const password = 'password';
            const personal = false;
            const userGroup = new UserGroup();
            userGroup.permission = 1
            const userDetails = {
                userGroups : [
                    userGroup
                ]
            }

            const responsePost = {
                data : {
                    token : "token",
                },
            };
            const responseGet = {
                data : {
                    epp_userName : ""
                }
            }

            mockAxios.post.mockResolvedValue(responsePost);
            mockAxios.get.mockResolvedValue(responseGet);
            mockRedis.get.mockResolvedValue(JSON.stringify(userDetails));
            mockUserGroupRepository.findOne.mockResolvedValue(userGroup);
        
            
            //when
            const result = await userDataProductMangementService.integrateUserWithWExternalAPI(token, type, allocateToName, username, password, personal);

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe('success');
            expect(result.message).toBe('User is integrated with DNS');
        })
        

        
      })

      describe('integrateWithDataProducts', () => {
        
        it('user does not exist',async () => {
            //given
            const token = 'token'
            const type = 'type';
            const allocateToName = 'allocateToName';
            const personal = true;


            //when
            const result = await userDataProductMangementService.integrateWithDataProducts(token, type, allocateToName, personal)

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('User does not exist');

        })

        it('success',async () => {
            //given
            const token = 'token'
            const type = 'type';
            const allocateToName = 'allocateToName';
            const personal = true;
            const user = new User();

            mockUserRepository.findOne.mockResolvedValue(user);


            //when
            const result = await userDataProductMangementService.integrateWithDataProducts(token, type, allocateToName, personal)

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe('success');
            expect(result.message).toBe(user);

        })

        it('cannot find user with given name',async () => {
            //given
            const token = 'token'
            const type = 'type';
            const allocateToName = 'allocateToName';
            const personal = false;

            const userGroup = new UserGroup();
            userGroup.permission = 1
            const userDetails = {
                userGroups : [
                    userGroup
                ]
            }
            
            mockRedis.get.mockResolvedValue(JSON.stringify(userDetails));

            //when
            const result = await userDataProductMangementService.integrateWithDataProducts(token, type, allocateToName, personal)

            //then
            expect(result).not.toBeNull;
            expect(result.status).toBe(400);
            expect(result.error).toBe(true);
            expect(result.message).toBe('Cannot find user group with given name');

        })
        
      })


})