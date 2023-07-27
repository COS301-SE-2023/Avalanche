/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import { Dashboard } from '../../entity/dashboard.entity';
import { UserDashboardMangementService } from './user-dashboard-management.service';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

jest.mock('ioredis');

describe('UserDashboardMangementService', () => {
    let service: UserDashboardMangementService;
    let userRepository: Repository<User>;
    let userGroupRepository: Repository<UserGroup>;
    let organisationRepository: Repository<Organisation>;
    let dashboardRepository: Repository<Dashboard>;
    let redis;

    const mockRedisInstance = {
        get: jest.fn().mockResolvedValue(JSON.stringify({ email: 'test@email.com' })),
        set: jest.fn().mockResolvedValue('OK')
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UserDashboardMangementService,
                { provide: getRepositoryToken(User), useClass: Repository },
                { provide: getRepositoryToken(UserGroup), useClass: Repository },
                { provide: getRepositoryToken(Organisation), useClass: Repository },
                { provide: getRepositoryToken(Dashboard), useClass: Repository },
                { provide: 'REDIS', useValue: mockRedisInstance },
                ConfigService
            ],
        }).compile();

        service = await moduleRef.get<UserDashboardMangementService>(UserDashboardMangementService);
        userRepository = await moduleRef.get(getRepositoryToken(User));
        userGroupRepository = await moduleRef.get(getRepositoryToken(UserGroup));
        organisationRepository = await moduleRef.get(getRepositoryToken(Organisation));
        dashboardRepository = await moduleRef.get(getRepositoryToken(Dashboard));
        redis = await moduleRef.get('REDIS');
    });

      
    jest.mock('ioredis', () => {
        return jest.fn().mockImplementation(() => {
          return mockRedisInstance;
        });
    });

    describe('saveDashboard', () => {
        const mockUser: User = {
            id: 1,
            email: 'test@email.com',
            firstName: 'test_firstName',
            lastName: 'test_lastName',
            password: 'test_password',
            salt: 'test_salt',
            apiKey: 'test_apiKey',
            products: [],
            userGroups: [],
            organisation: null,
            organisationId: 1,
            dashboards: [],
        };
    
        const mockDashboard: Dashboard = {
            autoID: 1,
            name: 'Dashboard1',
            user: [mockUser],
            dashboardID: 'dashboard1',
            graphs: []
        };
    
        it('should return error when user does not exist', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
            const result = await service.saveDashbaord('token', 'dashboardID', 'name', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not exist.',
                timestamp: expect.any(String),
            });
        });
    
        it('should return error when dashboard name is already in use', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            const result = await service.saveDashbaord('token', 'dashboardID', 'Dashboard1', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'This name is already in use.',
                timestamp: expect.any(String),
            });
        });
    
        // it('should save the dashboard when name is not provided', async () => {
        //     jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
        //     jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        //     jest.spyOn(dashboardRepository, 'save').mockResolvedValue(mockDashboard);
        //     jest.spyOn(redis, 'set').mockResolvedValue('OK');
        //     jest.spyOn(userRepository, 'save').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
    
        //     const result = await service.saveDashbaord('token', 'dashboardID', '', []);
        //     expect(result).toEqual({
        //         status: "success",
        //         message: [mockDashboard],
        //         timestamp: expect.any(String),
        //     });
        // });
    
        // it('should save the dashboard when name is provided', async () => {
        //     jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
        //     jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        //     jest.spyOn(dashboardRepository, 'save').mockResolvedValue(mockDashboard);
        //     jest.spyOn(redis, 'set').mockResolvedValue('OK');
        //     jest.spyOn(userRepository, 'save').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
    
        //     const result = await service.saveDashbaord('token', 'dashboardID', 'name', []);
        //     expect(result).toEqual({
        //         status: "success",
        //         message: [mockDashboard],
        //         timestamp: expect.any(String),
        //     });
        // });
    });

    // Write similar describe and it blocks for other methods in the service

    afterEach(() => {
        jest.clearAllMocks();
    });
});
