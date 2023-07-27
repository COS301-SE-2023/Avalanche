/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import { WatchedUser } from '../../entity/watch.entity';
import { UserDataProductMangementService } from './user-data-products-management.service';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserDataProductMangementService', () => {
    let service: UserDataProductMangementService;
    let userRepository: Repository<User>;
    let userGroupRepository: Repository<UserGroup>;
    let organisationRepository: Repository<Organisation>;
    let watchedUserRepository: Repository<WatchedUser>;
    let redis;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UserDataProductMangementService,
                { provide: getRepositoryToken(User), useClass: Repository },
                { provide: getRepositoryToken(UserGroup), useClass: Repository },
                { provide: getRepositoryToken(Organisation), useClass: Repository },
                { provide: getRepositoryToken(WatchedUser), useClass: Repository },
                { provide: 'REDIS', useValue: { get: jest.fn() } },
                ConfigService
            ],
        }).compile();

        service = await moduleRef.get<UserDataProductMangementService>(UserDataProductMangementService);
        userRepository = await moduleRef.get(getRepositoryToken(User));
        userGroupRepository = await moduleRef.get(getRepositoryToken(UserGroup));
        organisationRepository = await moduleRef.get(getRepositoryToken(Organisation));
        watchedUserRepository = await moduleRef.get(getRepositoryToken(WatchedUser));
        redis = await moduleRef.get('REDIS');
    });

    const mockRedisInstance = {
        set: jest.fn().mockResolvedValue('OK'),
        // add other methods as necessary
      };
      
      jest.mock('ioredis', () => {
        return jest.fn().mockImplementation(() => {
          return mockRedisInstance;
        });
      });

    describe('integrateUserWithWExternalAPI', () => {
        it('should return error when username or password is not provided', async () => {
          const result = await service.integrateUserWithWExternalAPI('token', 'type', 'name', '', '', true);
          expect(result).toEqual({
            status: 400, 
            error: true, 
            message: 'Please enter all account details',
            timestamp: expect.any(String)
          });
        });
    
        it('should return error when user does not exist and personal is true', async () => {
          mockedAxios.post.mockResolvedValue({ data: { token: 'token' } });
          mockedAxios.get.mockResolvedValue({ data: { epp_username: 'username' } });
          jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    
          const result = await service.integrateUserWithWExternalAPI('token', 'type', 'name', 'username', 'password', true);
          expect(result).toEqual({
            status: 400, 
            error: true, 
            message:'Please enter a zone that is from the given choices - AFRICA, RyCE, ZACR',
            timestamp: expect.any(String)
          });
        });
    });

    describe('integrateWithDataProducts', () => {
        it('should return error when user does not exist and personal is true', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            const result = await service.integrateWithDataProducts('token', 'type', 'name', true);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not exist',
                timestamp: expect.any(String)
            });
        });

        it('should return success when user exist and personal is true', async () => {
            const mockUser = { products: '' };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
            jest.spyOn(userRepository, 'save').mockResolvedValue(null);

            const result = await service.integrateWithDataProducts('token', 'type', 'name', true);
            expect(result).toEqual({
                status: 'success',
                message: mockUser,
                timestamp: expect.any(String)
            });
        });

        it('should return error when user group does not exist and personal is false', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ userGroups: [{ permission: 1 }] }));
            jest.spyOn(userGroupRepository, 'findOne').mockResolvedValue(null);

            const result = await service.integrateWithDataProducts('token', 'type', 'name', false);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Cannot find user group with given name',
                timestamp: expect.any(String)
            });
        });

        it('should return error when user does not have the right permissions and personal is false', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ userGroups: [{ permission: 0 }] }));
            const result = await service.integrateWithDataProducts('token', 'type', 'name', false);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not have the right permissions',
                timestamp: expect.any(String)
            });
        });

        it('should return error when personal is neither true nor false', async () => {
            const result = await service.integrateWithDataProducts('token', 'type', 'name', null);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Error occured, please try later again',
                timestamp: expect.any(String)
            });
        });

        // add more tests...
    });

    describe('addDomainWatchPassiveDetails', () => {
        it('should return error when token is invalid', async () => {
          jest.spyOn(redis, 'get').mockResolvedValue(null);
    
          const result = await service.addDomainWatchPassiveDetails('invalidToken', [], []);
          expect(result).toEqual({
            status: 400, 
            error: true, 
            message: 'Invalid token.',
            timestamp: expect.any(String)
          });
        });
    
        it('should return error when user does not exist', async () => {
          jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
          jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    
          const result = await service.addDomainWatchPassiveDetails('token', [], []);
          expect(result).toEqual({
            status: 400, 
            error: true, 
            message: 'User does not exist.',
            timestamp: expect.any(String)
          });
        });
    
        it('should return success when user exists', async () => {
          jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
          const mockUser = { firstName: 'test', lastName: 'user', email: 'test@email.com' };
          jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as any);
          jest.spyOn(watchedUserRepository, 'findOne').mockResolvedValue(null); // Add this if not present
          jest.spyOn(watchedUserRepository, 'save').mockResolvedValue(null);
        
          const result = await service.addDomainWatchPassiveDetails('token', [], []);
          expect(result).toEqual({
            status: 'success',
            message: 'User added to watched list',
            timestamp: expect.any(String)
          });
        });
    });
    
    describe('getDomainWatchPassive', () => {
        it('should return error when no domains to be watched', async () => {
          jest.spyOn(watchedUserRepository, 'find').mockResolvedValue(null);
    
          const result = await service.getDomainWatchPassive();
          expect(result).toEqual({
            status: 400, 
            error: true, 
            message: 'Null, there is no domains to be watched',
            timestamp: expect.any(String)
          });
        });
    
        it('should return success when there are domains to be watched', async () => {
          const mockPassiveData = [{ id: 1, email: 'test@example.com', person: 'test', types: [], domains: [] }];
          jest.spyOn(watchedUserRepository, 'find').mockResolvedValue(mockPassiveData);
    
          const result = await service.getDomainWatchPassive();
          expect(result).toEqual({ watched: mockPassiveData , emailData : mockPassiveData});
        });
    });
    

    afterEach(() => {
        jest.clearAllMocks();
    });
});
