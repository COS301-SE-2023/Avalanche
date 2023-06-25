import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './services/auth.service';
import { UserOrganisationMangementService } from './services/user-organisation-mangement.service';
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
      })
      .overrideProvider(UserDataProductMangementService)
      .useValue({
        // methods from UserDataProductMangementService
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
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.register(registerDto)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.firstName,
        registerDto.lastName,
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
      const verifyDto = { email: 'test@example.com', otp: '1234' };
      jest
        .spyOn(authService, 'verify')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.verify(verifyDto)).toBe(result);
      expect(authService.verify).toHaveBeenCalledWith(
        verifyDto.email,
        verifyDto.otp,
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
      const loginDto = { email: 'test@example.com', password: 'password' };
      jest
        .spyOn(authService, 'login')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
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
      const userInfoDto = { token: 'some_token' };
      jest
        .spyOn(userOrgManService, 'getUserInfo')
        .mockImplementation(() => Promise.resolve(result));

      expect(await appController.getUserInfo(userInfoDto)).toBe(result);
      expect(userOrgManService.getUserInfo).toHaveBeenCalledWith(
        userInfoDto.token,
      );
    });
  });
});
