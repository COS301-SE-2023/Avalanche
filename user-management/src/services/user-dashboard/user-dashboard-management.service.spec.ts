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
                { provide: getRepositoryToken(User, 'user'), useClass: Repository },
                { provide: getRepositoryToken(UserGroup, 'user'), useClass: Repository },
                { provide: getRepositoryToken(Organisation, 'user'), useClass: Repository },
                { provide: getRepositoryToken(Dashboard, 'user'), useClass: Repository },
                { provide: 'REDIS', useValue: mockRedisInstance },
                ConfigService
            ],
        }).compile();

        service = await moduleRef.get<UserDashboardMangementService>(UserDashboardMangementService);
        userRepository = await moduleRef.get(getRepositoryToken(User, 'user'));
        userGroupRepository = await moduleRef.get(getRepositoryToken(UserGroup, 'user'));
        organisationRepository = await moduleRef.get(getRepositoryToken(Organisation, 'user'));
        dashboardRepository = await moduleRef.get(getRepositoryToken(Dashboard, 'user'));
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

        it('should generate a name when name is not provided or name length is 0', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [] });
            jest.spyOn(dashboardRepository, 'save').mockResolvedValue(mockDashboard);
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
            const result = await service.saveDashbaord('token', 'dashboardID', '', []);
            expect(result).toEqual({
                status: "success",
                message: expect.any(Array),
                timestamp: expect.any(String),
            });
        });

        it('should successfully save a dashboard', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [] });
            jest.spyOn(dashboardRepository, 'save').mockResolvedValue(mockDashboard);
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
            const result = await service.saveDashbaord('token', 'dashboardID', 'Dashboard2', []);
            expect(result).toEqual({
                status: "success",
                message: expect.any(Array),
                timestamp: expect.any(String),
            });
        });

        it('should return error when user payload is not retrieved from Redis', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(null);
            const result = await service.saveDashbaord('token', 'dashboardID', 'Dashboard2', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Invalid token.',
                timestamp: expect.any(String),
            });
        });

    });

    describe('editDashboard', () => {
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

        it('should return error when user payload is not retrieved from Redis', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(null);
            const result = await service.editDashbaord('token', 'dashboardID', 'Dashboard2', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Invalid token.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when user does not exist', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
            const result = await service.editDashbaord('token', 'dashboardID', 'name', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not exist.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when dashboard name is not provided or name length is 0', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            const result = await service.editDashbaord('token', 'dashboardID', '', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Please enter a valid dashboard name.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when user does not have a dashboard with provided dashboardID', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            const result = await service.editDashbaord('token', 'wrongDashboardID', 'Dashboard1', []);
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not have a dashboard with this name.',
                timestamp: expect.any(String),
            });
        });

        it('should successfully edit a dashboard', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            jest.spyOn(dashboardRepository, 'save').mockResolvedValue(mockDashboard);
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
            const result = await service.editDashbaord('token', 'dashboard1', 'Dashboard1', []);
            expect(result).toEqual({
                status: "success",
                message: expect.any(Array),
                timestamp: expect.any(String),
            });
        });
    });

    describe('shareDashboards', () => {
        const mockUserGroup: UserGroup = {
            id: 1,
            name: 'UserGroup1',
            users: [],
            permission: 1,
            organisation: null,
            organisationId: 1,
            products: []
        };

        const mockUser: User = {
            id: 1,
            email: 'test@email.com',
            firstName: 'test_firstName',
            lastName: 'test_lastName',
            password: 'test_password',
            salt: 'test_salt',
            apiKey: 'test_apiKey',
            products: [],
            userGroups: [mockUserGroup],
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

        const mockUser1: User = {
            id: 1,
            email: 'test@email.com',
            firstName: 'test_firstName',
            lastName: 'test_lastName',
            password: 'test_password',
            salt: 'test_salt',
            apiKey: 'test_apiKey',
            products: [],
            userGroups: [mockUserGroup],
            organisation: null,
            organisationId: 1,
            dashboards: [mockDashboard],
        };


        it('should return error when user payload is not retrieved from Redis', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(null);
            const result = await service.shareDashboards('token', 'UserGroup1', 'dashboard1');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Invalid token.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when user does not exist', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
            const result = await service.shareDashboards('token', 'UserGroup1', 'dashboard1');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not exist.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when dashboard does not exist', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser1 });
            const result = await service.shareDashboards('token', 'UserGroup1', 'wrongDashboardID');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Dashboard does not exsit.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when user is not part of the user group', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            const result = await service.shareDashboards('token', 'UserGroup2', 'dashboard1');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'This user is not apart of the user group.',
                timestamp: expect.any(String),
            });
        });

        it('should successfully share dashboard', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            jest.spyOn(userGroupRepository, 'findOne').mockResolvedValue({ ...mockUser.userGroups[0], users: [mockUser] });
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
            const result = await service.shareDashboards('token', 'UserGroup1', 'dashboard1');
            expect(result).toEqual({
                status: "success",
                message: "shared dashboard",
                timestamp: expect.any(String),
            });
        });
    });

    describe('addCommentToGraph', () => {
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
            graphs: [{graphName: 'graph1',
                endpointName: 'endpoint1',
                filters: [],
                comments: []}],
        };

        it('should return error when user payload is not retrieved from Redis', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(null);
            const result = await service.addCommentToGraph('token', 'dashboardID', 'graph1', 'test comment');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Invalid token.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when user does not exist', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
            const result = await service.addCommentToGraph('token', 'dashboardID', 'graph1', 'test comment');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not exist.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when dashboard id is not provided or its length is 0', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            const result = await service.addCommentToGraph('token', '', 'graph1', 'test comment');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'Please enter a valid dashboard id.',
                timestamp: expect.any(String),
            });
        });

        it('should return error when user does not have a dashboard with provided dashboardID or graph with provided graphName', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            const result = await service.addCommentToGraph('token', 'wrongDashboardID', 'graph1', 'test comment');
            expect(result).toEqual({
                status: 400,
                error: true,
                message: 'User does not have a dashboard with this name.',
                timestamp: expect.any(String),
            });
        });

        it('should successfully add a comment to a graph', async () => {
            jest.spyOn(redis, 'get').mockResolvedValue(JSON.stringify({ email: 'test@email.com' }));
            jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, dashboards: [mockDashboard] });
            jest.spyOn(dashboardRepository, 'save').mockResolvedValue(mockDashboard);
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
            const result = await service.addCommentToGraph('token', 'dashboard1', 'graph1', 'test comment');
            expect(result).toEqual({
                status: "success",
                message: expect.any(Array),
                timestamp: expect.any(String),
            });
        });
    });


    afterEach(() => {
        jest.clearAllMocks();
    });
});
