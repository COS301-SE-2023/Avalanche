import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementService } from './user-management.service';
import { ClientProxy } from '@nestjs/microservices';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserManagementService,
        {
          provide: 'USER_MANAGEMENT_SERVICE',
          useValue: {
            send: jest.fn().mockImplementation(() => ({
              toPromise: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UserManagementService>(UserManagementService);
    client = module.get<ClientProxy>('USER_MANAGEMENT_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const testCases = [
    { method: 'register', cmd: 'register' },
    { method: 'verify', cmd: 'verify' },
    { method: 'resendOTP', cmd: 'resendOTP' },
    { method: 'login', cmd: 'login' },
    { method: 'createOrganisation', cmd: 'createOrganisation' },
    { method: 'getUserInfo', cmd: 'getUserInfo' },
    { method: 'getMembers', cmd: 'getMembers' },
    { method: 'createUserGroup', cmd: 'createUserGroup' },
    { method: 'addUserToUserGroup', cmd: 'addUserToUserGroup' },
    { method: 'exitUserGroup', cmd: 'exitUserGroup' },
    { method: 'removeUserFromUserGroup', cmd: 'removeUserFromUserGroup' },
    { method: 'exitOrganisation', cmd: 'exitOrganisation' },
    { method: 'removeUserFromOrganisation', cmd: 'removeUserFromOrganisation' },
    { method: 'addUserToUserGroupWithKey', cmd: 'addUserToUserGroupWithKey' },
    { method: 'integrateUserWithZARCExternalAPI', cmd: 'integrateUserWithZARCExternalAPI' },
    { method: 'integrateWithDataProducts', cmd: 'integrateWithDataProducts' },
    { method: 'createAPIKey', cmd: 'createAPIKey'},
    { method: 'checkUserAPIKey', cmd: 'checkUserAPIKey'},
    { method: 'rerollAPIKey', cmd: 'rerollAPIKey'},
    { method: 'saveDashboard', cmd: 'saveDashboard'},
    { method: 'editDashboard', cmd: 'editDashboard'},
    { method: 'shareDashboards', cmd: 'shareDashboards'},
    { method: 'addCommentToGraph', cmd: 'addCommentToGraph'},
    { method: 'addDomainWatchPassiveDetails', cmd: 'addDomainWatchPassiveDetails'},
    { method: 'getDomainWatchPassive', cmd: 'getDomainWatchPassive'}
  ];

  testCases.forEach(({ method, cmd }) => {
    it(`should call client.send with "${cmd}" when "${method}" is called`, async () => {
      const data = { foo: 'bar' };
      await (service as any)[method](data);
      expect(client.send).toHaveBeenCalledWith({ cmd }, data);
    });
  });
});
