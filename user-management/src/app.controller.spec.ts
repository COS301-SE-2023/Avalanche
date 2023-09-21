/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './services/auth/auth.service';
import { UserOrganisationMangementService } from './services/user-organisation/user-organisation-mangement.service';
import { UserDataProductMangementService } from './services/user-data-products/user-data-products-management.service';
import { UserDashboardMangementService } from './services/user-dashboard/user-dashboard-management.service';
import { UserUserGroupMangementService } from './services/user-userGroup/user-userGroup-management.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard } from './entity/dashboard.entity';
import { Organisation } from './entity/organisation.entity';
import { User } from './entity/user.entity';
import { UserGroup } from './entity/userGroup.entity';
import { WatchedUser } from './entity/watch.entity';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;
  let userOrgManService: UserOrganisationMangementService;
  let userDataProductManService: UserDataProductMangementService;
  let userUserGroupManService: UserUserGroupMangementService;
  let userDashboardManService: UserDashboardMangementService;
  const mockRedis = {
    // mock methods that you use from the redis module
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    // add other methods you may use
  };
  const config = {
    get: jest.fn()
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AuthService,
        UserOrganisationMangementService,
        UserDataProductMangementService,
        UserDashboardMangementService,
        UserUserGroupMangementService,
        { provide: getRepositoryToken(User,"user"), useClass: Repository },
        { provide: getRepositoryToken(UserGroup,"user"), useClass: Repository },
        { provide: getRepositoryToken(Organisation,"user"), useClass: Repository },
        { provide: getRepositoryToken(Dashboard,"user"), useClass: Repository },
        { provide: getRepositoryToken(WatchedUser,"user"), useClass: Repository },
        { provide: 'REDIS', useValue: mockRedis },
        { provide: ConfigService, useValue: config }
      ],
    })
      .overrideProvider(AuthService)
      .useValue({
        register: jest.fn(),
        verify: jest.fn(),
        login: jest.fn(),
        resendOTP: jest.fn(),
        getUserInfo: jest.fn(),
        createAPIKey : jest.fn(),
        checkUserAPIKey : jest.fn(),
        rerollAPIKey : jest.fn()
      })
      .overrideProvider(UserOrganisationMangementService)
      .useValue({
        getMembers: jest.fn(),
        createOrganisation: jest.fn(),
        addUserToOrganisation: jest.fn(),
        exitOrganisation: jest.fn(),
        removeUserFromOrganisation: jest.fn(),
      })
      .overrideProvider(UserUserGroupMangementService)
      .useValue({
        createUserGroup: jest.fn(),
        addUserToUserGroup: jest.fn(),
        removeUserFromUserGroup: jest.fn(),
        exitUserGroup: jest.fn(),
        addUserToUserGroupWithKey: jest.fn(),
      })
      .overrideProvider(UserDataProductMangementService)
      .useValue({
        integrateUserWithZARCExternalAPI: jest.fn(),
        integrateWithDataProducts: jest.fn(),
        addDomainWatchPassiveDetails : jest.fn(),
        getDomainWatchPassive : jest.fn()
      })
      .overrideProvider(UserDashboardMangementService)
      .useValue({
        saveDashbaord: jest.fn(),
        editDashbaord: jest.fn(),
        shareDashboards : jest.fn(),
        addCommentToGraph : jest.fn()
      })
      .compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
    userOrgManService = app.get<UserOrganisationMangementService>(
      UserOrganisationMangementService,
    );
    userUserGroupManService = app.get<UserUserGroupMangementService>(
      UserUserGroupMangementService,
    );
    userDashboardManService = app.get<UserDashboardMangementService>(
      UserDashboardMangementService,
    );
    userDataProductManService = app.get<UserDataProductMangementService>(
      UserDataProductMangementService,
    );
  });

  describe('register', () => {
    it('should return the result of authService.register()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'hi',
        timestamp: 'time',
      };
      const registerData = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.register(registerData)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName,
      );
    });
  });

  describe('verify', () => {
    it('should return the result of authService.verify()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'hi',
        timestamp: 'time',
      };
      const verifyData = { email: 'test@example.com', otp: '1234' };
      jest
        .spyOn(authService, 'verify')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.verify(verifyData)).toBe(result);
      expect(authService.verify).toHaveBeenCalledWith(
        verifyData.email,
        verifyData.otp,
      );
    });
  });

  // Login method
  describe('login', () => {
    it('should return the result of authService.login()', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };
      const result = {
        status: 200,
        error: false,
        message: 'hi',
        timestamp: 'time',
      };
      const loginData = { email: 'test@example.com', password: 'password' };
      jest
        .spyOn(authService, 'login')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.login(loginData)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
    });
  });

  //resend OTP method
  describe('resend OTP', () => {
    it('should return the result of authService.resendOTP()', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };
      const result = {
        status: 200,
        error: false,
        message: 'hi',
        timestamp: 'time',
      };
      const loginData = { email: 'test@example.com' };
      jest
        .spyOn(authService, 'resendOTP')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.resendOTP(loginData)).toBe(result);
      expect(authService.resendOTP).toHaveBeenCalledWith(loginData.email);
    });
  });

  // GetUserInformation method
  describe('getUserInfo', () => {
    it('should return the result of userOrgManService.getUserInfo()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = { token: 'some_token' };
      jest
        .spyOn(authService, 'getUserInfo')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.getUserInfo(userInfoData)).toBe(result);
      expect(authService.getUserInfo).toHaveBeenCalledWith(
        userInfoData.token,
      );
    });
  });

  describe('createAPIKey', () => {
    it('should return the result of authService.createAPIKey()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Key created successfully',
        timestamp: 'time',
      };
      const data = { token: 'testToken' };
  
      jest.spyOn(authService, 'createAPIKey')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.createAPIKey(data)).toBe(result);
      expect(authService.createAPIKey).toHaveBeenCalledWith(data.token);
    });
  });
  
  describe('checkUserAPIKey', () => {
    it('should return the result of authService.checkUserAPIKey()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Key is valid',
        timestamp: 'time',
      };
      const data = { token: 'testToken' };
  
      jest.spyOn(authService, 'checkUserAPIKey')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.checkUserAPIKey(data)).toBe(result);
      expect(authService.checkUserAPIKey).toHaveBeenCalledWith(data.token);
    });
  });
  
  describe('rerollAPIKey', () => {
    it('should return the result of authService.rerollAPIKey()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Key rerolled successfully',
        timestamp: 'time',
      };
      const data = { token: 'testToken' };
  
      jest.spyOn(authService, 'rerollAPIKey')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.rerollAPIKey(data)).toBe(result);
      expect(authService.rerollAPIKey).toHaveBeenCalledWith(data.token);
    });
  });
  

  // GetMembers method
  describe('getMembers', () => {
    it('should return the result of userOrgManService.getMembers()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = { token: 'some_token' };
      jest
        .spyOn(userOrgManService, 'getMembers')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.getMembers(userInfoData)).toBe(result);
      expect(userOrgManService.getMembers).toHaveBeenCalledWith(
        userInfoData.token,
      );
    });
  });

  //CreateOrganisation Method
  describe('createOrganisation', () => {
    it('should return the result of userOrgManService.createOrganisation()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = { token: 'some_token', name: 'Org1' };
      jest
        .spyOn(userOrgManService, 'createOrganisation')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.createOrganisation(userInfoData)).toBe(result);
      expect(userOrgManService.createOrganisation).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.name,
      );
    });
  });

  //CreateUserGrouup Method
  describe('createUserGroup', () => {
    it('should return the result of userOrgManService.createUserGroup()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        name: 'userGroup2',
        permission: 1, //1 means admin, 2 means other e.g sales
      };
      jest
        .spyOn(userUserGroupManService, 'createUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.createUserGroup(userInfoData)).toBe(result);
      expect(userUserGroupManService.createUserGroup).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.name,
        userInfoData.permission,
      );
    });
  });

  //AddUserToGroup Method
  describe('addUserToUserGroup', () => {
    it('should return the result of userOrgManService.addUserToUserGroup()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        userEmail: 'example1@example.com',
        userGroupName: 'userGroup1',
      };
      jest
        .spyOn(userUserGroupManService, 'addUserToUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.addUserToUserGroup(userInfoData)).toBe(result);
      expect(userUserGroupManService.addUserToUserGroup).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.userEmail,
        userInfoData.userGroupName,
      );
    });
  });

  //AddUserToGroup Method
  describe('exitOrganisation', () => {
    it('should return the result of userOrgManService.exitOrganisation()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        organisationName: 'string',
      };
      jest
        .spyOn(userOrgManService, 'exitOrganisation')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.exitOrganisation(userInfoData)).toBe(result);
      expect(userOrgManService.exitOrganisation).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.organisationName,
      );
    });
  });

  //ExitUserGroup Method
  describe('exitUserGroup', () => {
    it('should return the result of userOrgManService.exitUserGroup()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        userGroupName: 'userGroup1',
      };
      jest
        .spyOn(userUserGroupManService, 'exitUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.exitUserGroup(userInfoData)).toBe(result);
      expect(userUserGroupManService.exitUserGroup).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.userGroupName,
      );
    });
  });

  //removeUserFromUserGroup Method
  describe('removeUserFromUserGroup ', () => {
    it('should return the result of userOrgManService.removeUserFromUserGroup ()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        userGroupName: 'userGroup1',
        userEmail: 'example1@example.com',
      };
      jest
        .spyOn(userUserGroupManService, 'removeUserFromUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.removeUserFromUserGroup(userInfoData)).toBe(
        result,
      );
      expect(userUserGroupManService.removeUserFromUserGroup).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.userGroupName,
        userInfoData.userEmail,
      );
    });
  });

  //removeUserFromOrganisation Method
  describe('removeUserFromOrganisation ', () => {
    it('should return the result of userOrgManService.removeUserFromOrganisation()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        organisationName: 'org1',
        userEmail: 'example1@example.com',
      };
      jest
        .spyOn(userOrgManService, 'removeUserFromOrganisation')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.removeUserFromOrganisation(userInfoData)).toBe(
        result,
      );
      expect(userOrgManService.removeUserFromOrganisation).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.organisationName,
        userInfoData.userEmail,
      );
    });
  });

  //Method addUserToGroupWithKey
  describe('addUserToGroupWithKey ', () => {
    it('should return the result of userOrgManService.addUserToGroupWithKey()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        key: 'example123456789',
      };
      jest
        .spyOn(userUserGroupManService, 'addUserToUserGroupWithKey')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.addUserToUserGroupWithKey(userInfoData)).toBe(
        result,
      );
      expect(userUserGroupManService.addUserToUserGroupWithKey).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.key,
      );
    });
  });

  //Method integrate with external API
  describe('integrateWithExternalAPI', () => {
    it('should return the result of userDataProductManService.integrateUserWithZARCExternalAPI()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        type: 'string', //AFRICA, RyCE, ZACR
        allocateToName: 'string',
        username: 'string',
        password: 'string',
        personal: 'boolean', //true for user, false for userGroup
      };
      jest
        .spyOn(userDataProductManService, 'integrateUserWithZARCExternalAPI')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await appController.integrateUserWithZARCExternalAPI(userInfoData),
      ).toBe(result);
      expect(
        userDataProductManService.integrateUserWithZARCExternalAPI,
      ).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.type,
        userInfoData.allocateToName,
        userInfoData.username,
        userInfoData.password,
        userInfoData.personal,
      );
    });
  });

  //Method integrate with data products
  describe('integrateWithDataProducts', () => {
    it('should return the result of userDataProductManService.integrateWithDataProducts()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'msg',
        timestamp: 'time',
      };
      const userInfoData = {
        token: 'some_token',
        type: 'string', //AFRICA, RyCE, ZACR
        allocateToName: 'string',
        personal: 'boolean', //true for user, false for userGroup
      };
      jest
        .spyOn(userDataProductManService, 'integrateWithDataProducts')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.integrateWithDataProducts(userInfoData)).toBe(
        result,
      );
      expect(
        userDataProductManService.integrateWithDataProducts,
      ).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.type,
        userInfoData.allocateToName,
        userInfoData.personal,
      );
    });
  });

  describe('addDomainWatchPassiveDetails', () => {
    it('should return the result of userDataProductManService.addDomainWatchPassiveDetails()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Domain watch passive details added successfully',
        timestamp: 'time',
      };
      const data = {
        token: 'testToken',
        types: ['type1', 'type2'],
        domains: ['domain1', 'domain2']
      };
  
      jest.spyOn(userDataProductManService, 'addDomainWatchPassiveDetails')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.addDomainWatchPassiveDetails(data)).toBe(result);
      expect(userDataProductManService.addDomainWatchPassiveDetails).toHaveBeenCalledWith(data.token, data.types, data.domains);
    });
  });
  
  describe('getDomainWatchPassive', () => {
    it('should return the result of userDataProductManService.getDomainWatchPassive()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Fetched domain watch passive successfully',
        timestamp: 'time',
      };
  
      jest.spyOn(userDataProductManService, 'getDomainWatchPassive')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.getDomainWatchPassive({})).toBe(result);
      expect(userDataProductManService.getDomainWatchPassive).toHaveBeenCalled();
    });
  });
  
  describe('saveDashboard', () => {
    it('should return the result of userDashboardManService.saveDashbaord()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Dashboard saved successfully',
        timestamp: 'time',
      };
      const data = {
        token: 'testToken',
        dashboardID: 'dashboardID',
        name: 'name',
        graphs: 'graphs'
      };
  
      jest.spyOn(userDashboardManService, 'saveDashbaord')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.saveDashboard(data)).toBe(result);
      expect(userDashboardManService.saveDashbaord).toHaveBeenCalledWith(data.token, data.dashboardID, data.name, data.graphs);
    });
  });
  
  describe('editDashboard', () => {
    it('should return the result of userDashboardManService.editDashbaord()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Dashboard edited successfully',
        timestamp: 'time',
      };
      const data = {
        token: 'testToken',
        dashboardID: 'dashboardID',
        name: 'name',
        graphs: 'graphs'
      };
  
      jest.spyOn(userDashboardManService, 'editDashbaord')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.editDashboard(data)).toBe(result);
      expect(userDashboardManService.editDashbaord).toHaveBeenCalledWith(data.token, data.dashboardID, data.name, data.graphs);
    });
  });
  
  describe('shareDashboards', () => {
    it('should return the result of userDashboardManService.shareDashboards()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Dashboard shared successfully',
        timestamp: 'time',
      };
      const data = {
        token: 'testToken',
        userGroupName: 'userGroupName',
        dashboardID: 'dashboardID'
      };
  
      jest.spyOn(userDashboardManService, 'shareDashboards')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.shareDashboards(data)).toBe(result);
      expect(userDashboardManService.shareDashboards).toHaveBeenCalledWith(data.token, data.userGroupName, data.dashboardID);
    });
  });
  
  describe('addCommentToGraph', () => {
    it('should return the result of userDashboardManService.addCommentToGraph()', async () => {
      const result = {
        status: 200,
        error: false,
        message: 'Comment added successfully',
        timestamp: 'time',
      };
      const data = {
        token: 'testToken',
        dashboardID: 'dashboardID',
        graphName: 'graphName',
        comment: 'comment'
      };
  
      jest.spyOn(userDashboardManService, 'addCommentToGraph')
        .mockImplementation(() => Promise.resolve(result));
  
      expect(await appController.addCommentToGraph(data)).toBe(result);
      expect(userDashboardManService.addCommentToGraph).toHaveBeenCalledWith(data.token, data.dashboardID, data.graphName, data.comment);
    });
  });
  
});
