import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './services/auth/auth.service';
import { UserOrganisationMangementService } from './services/user-organisation/user-organisation-mangement.service';
import { UserDataProductMangementService } from './services/user-data-products-management.service';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;
  let userOrgManService: UserOrganisationMangementService;
  let userDataProductManService: UserDataProductMangementService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AuthService,
        UserOrganisationMangementService,
        UserDataProductMangementService,
      ],
    })
      .overrideProvider(AuthService)
      .useValue({
        register: jest.fn(),
        verify: jest.fn(),
        login: jest.fn(),
        resendOTP: jest.fn(),
      })
      .overrideProvider(UserOrganisationMangementService)
      .useValue({
        getUserInfo: jest.fn(),
        getMembers: jest.fn(),
        createOrganisation: jest.fn(),
        createUserGroup: jest.fn(),
        addUserToUserGroup: jest.fn(),
        addUserToOrganisation: jest.fn(),
        exitOrganisation: jest.fn(),
        removeUserFromUserGroup: jest.fn(),
        exitUserGroup: jest.fn(),
        removeUserFromOrganisation: jest.fn(),
        addUserToUserGroupWithKey: jest.fn(),
      })
      .overrideProvider(UserDataProductMangementService)
      .useValue({
        integrateUserWithWExternalAPI: jest.fn(),
        integrateWithDataProducts: jest.fn(),
      })
      .compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
    userOrgManService = app.get<UserOrganisationMangementService>(
      UserOrganisationMangementService,
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
        .spyOn(userOrgManService, 'getUserInfo')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.getUserInfo(userInfoData)).toBe(result);
      expect(userOrgManService.getUserInfo).toHaveBeenCalledWith(
        userInfoData.token,
      );
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
        .spyOn(userOrgManService, 'createUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.createUserGroup(userInfoData)).toBe(result);
      expect(userOrgManService.createUserGroup).toHaveBeenCalledWith(
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
        .spyOn(userOrgManService, 'addUserToUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.addUserToUserGroup(userInfoData)).toBe(result);
      expect(userOrgManService.addUserToUserGroup).toHaveBeenCalledWith(
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
        .spyOn(userOrgManService, 'exitUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.exitUserGroup(userInfoData)).toBe(result);
      expect(userOrgManService.exitUserGroup).toHaveBeenCalledWith(
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
        .spyOn(userOrgManService, 'removeUserFromUserGroup')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.removeUserFromUserGroup(userInfoData)).toBe(
        result,
      );
      expect(userOrgManService.removeUserFromUserGroup).toHaveBeenCalledWith(
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
        .spyOn(userOrgManService, 'addUserToUserGroupWithKey')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.addUserToUserGroupWithKey(userInfoData)).toBe(
        result,
      );
      expect(userOrgManService.addUserToUserGroupWithKey).toHaveBeenCalledWith(
        userInfoData.token,
        userInfoData.key,
      );
    });
  });

  //Method integrate with external API
  describe('integrateWithExternalAPI', () => {
    it('should return the result of userDataProductManService.integrateUserWithWExternalAPI()', async () => {
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
        .spyOn(userDataProductManService, 'integrateUserWithWExternalAPI')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await appController.integrateUserWithWExternalAPI(userInfoData),
      ).toBe(result);
      expect(
        userDataProductManService.integrateUserWithWExternalAPI,
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
});
