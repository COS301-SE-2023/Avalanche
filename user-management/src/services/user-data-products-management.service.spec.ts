/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDataProductMangementService } from './user-data-products-management.service';
import { User } from '../entity/user.entity';
import { UserGroup } from '../entity/userGroup.entity';
import { Organisation } from '../entity/organisation.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
jest.mock('axios');
describe('UserDataProductMangementService', () => {
    let service: UserDataProductMangementService;
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    let userRepository: Repository<User>;
    let userGroupRepository: Repository<UserGroup>;
    let organisationRepository: Repository<Organisation>;
    let configService: ConfigService;
    let redisService: Redis;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserDataProductMangementService,
                { provide: getRepositoryToken(User), useClass: Repository },
                { provide: getRepositoryToken(UserGroup), useClass: Repository },
                { provide: getRepositoryToken(Organisation), useClass: Repository },
                { provide: 'REDIS', useValue: {} },
                { provide: ConfigService, useValue: {} },
                { provide: axios, useValue: mockedAxios }
            ],
        }).compile();

        service = module.get<UserDataProductMangementService>(UserDataProductMangementService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        userGroupRepository = module.get<Repository<UserGroup>>(getRepositoryToken(UserGroup));
        organisationRepository = module.get<Repository<Organisation>>(getRepositoryToken(Organisation));
        configService = module.get<ConfigService>(ConfigService);
        redisService = module.get<Redis>('REDIS');
        mockedAxios.get.mockClear();
        mockedAxios.post.mockClear();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('integrateUserWithWExternalAPI', () => {
        const redisSetMock = jest.fn();
        beforeEach(() => {
            redisService.set = redisSetMock;
        });

        it('should return error if username or password is not provided', async () => {
            const response = await service.integrateUserWithWExternalAPI('', '', '', '', '', true);
            expect(response.status).toEqual(400);
            expect(response.error).toEqual(true);
            expect(response.message).toEqual('Please enter all account details');
        });

        it('should return error if type is not AFRICA, ZACR, or RyCE', async () => {
            const response = await service.integrateUserWithWExternalAPI('token', 'invalidType', 'name', 'username', 'password', true);
            expect(response.status).toEqual(400);
            expect(response.error).toEqual(true);
        });

        it('should return error if user does not exist', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(null);
            const response = await service.integrateUserWithWExternalAPI('token', 'AFRICA', 'name', 'username', 'password', true);
            expect(response.status).toEqual(400);
            expect(response.error).toEqual(true);
        });

        it('should integrate user if everything is provided correctly', async () => {
            const tokenFromDNS = '123456';
            const epp_username = 'username';
            mockedAxios.post.mockResolvedValueOnce({ data: { token: tokenFromDNS } });
            mockedAxios.get.mockResolvedValueOnce({ data: { epp_username: epp_username } });
            userRepository.findOne = jest.fn().mockResolvedValue({ email: 'name', products: '' });
            userRepository.save = jest.fn().mockResolvedValue(true);

            const response = await service.integrateUserWithWExternalAPI('token', 'AFRICA', 'name', 'username', 'password', true);
            expect(response.status).toEqual('success');
            expect(response.message).toEqual('User is integrated with DNS');
            expect(redisSetMock).toHaveBeenCalled();
        });

        it('should return error if invalid token for group based integration', async () => {
            redisService.get = jest.fn().mockResolvedValue(null);
            const response = await service.integrateUserWithWExternalAPI('invalidToken', 'AFRICA', 'name', 'username', 'password', false);
            expect(response.status).toEqual(400);
            expect(response.error).toEqual(true);
            expect(response.message).toEqual('Invalid token');
        });

        it('should return error if user group does not exist', async () => {
            redisService.get = jest.fn().mockResolvedValue(JSON.stringify({ userGroups: [{ permission: 1 }] }));
            userGroupRepository.findOne = jest.fn().mockResolvedValue(null);
            const response = await service.integrateUserWithWExternalAPI('token', 'AFRICA', 'name', 'username', 'password', false);
            expect(response.status).toEqual(400);
            expect(response.error).toEqual(true);
        });
    });

    describe('integrateWithDataProducts', () => {
        it('should integrate user with data products if everything is provided correctly', async () => {
            const user = {email: 'user@email.com', products: ''};
            userRepository.findOne = jest.fn().mockResolvedValue(user);
            userRepository.save = jest.fn().mockResolvedValue(true);
    
            const response = await service.integrateWithDataProducts('token', 'type', 'user@email.com', true);
            expect(response.status).toEqual('success');
            expect(response.message).toEqual(user);
        });
    
        it('should return error when user does not exist', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(null);
    
            const response = await service.integrateWithDataProducts('token', 'type', 'user@email.com', true);
            expect(response.status).toEqual(400);
            expect(response.message).toEqual('User does not exist');
        });
    
        it('should integrate user group with data products if everything is provided correctly', async () => {
            const userGroup = {name: 'group', products: ''};
            userGroupRepository.findOne = jest.fn().mockResolvedValue(userGroup);
            userGroupRepository.save = jest.fn().mockResolvedValue(true);
            redisService.get = jest.fn().mockResolvedValue(JSON.stringify({ userGroups: [{ permission: 1 }] }));
    
            const response = await service.integrateWithDataProducts('token', 'type', 'group', false);
            expect(response.status).toEqual('success');
            expect(response.message).toEqual('User group is integrated with type');
        });
    
        it('should return error when user group does not exist', async () => {
            userGroupRepository.findOne = jest.fn().mockResolvedValue(null);
            redisService.get = jest.fn().mockResolvedValue(JSON.stringify({ userGroups: [{ permission: 1 }] }));
    
            const response = await service.integrateWithDataProducts('token', 'type', 'group', false);
            expect(response.status).toEqual(400);
            expect(response.message).toEqual('Cannot find user group with given name');
        });
    
        it('should return error when user does not have the right permissions', async () => {
            redisService.get = jest.fn().mockResolvedValue(JSON.stringify({ userGroups: [{ permission: 0 }] }));
    
            const response = await service.integrateWithDataProducts('token', 'type', 'group', false);
            expect(response.status).toEqual(400);
            expect(response.message).toEqual('User does not have the right permissions');
        });
    
        it('should return error when personal argument is neither true nor false', async () => {
            const response = await service.integrateWithDataProducts('token', 'type', 'group', null);
            expect(response.status).toEqual(400);
            expect(response.message).toEqual('Error occured, please try later again');
        });
    });    
});
