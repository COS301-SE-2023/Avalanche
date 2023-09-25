/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import Redis from 'ioredis';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const mockJwtService = {
  sign: jest.fn(() => 'mockJwtToken'),
};
describe('AuthService', () => {
  let authService: AuthService;
  let mockRedis: jest.Mocked<Redis>;
  let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;


  beforeEach(async () => {
    const redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };


    const userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: getRepositoryToken(User, 'user'),
          useValue: userRepository,
        },
        {
          provide: 'REDIS',
          useValue: redis,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockRedis = module.get('REDIS');
    mockUserRepository = module.get(getRepositoryToken(User, 'user'));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const firstName = 'test';
      const lastName = 'test';

      mockRedis.set.mockResolvedValue('OK');

      // Mock the mail service
      jest.spyOn(authService, 'sendOTPEmail').mockResolvedValue();

      const result = await authService.register(email, password, firstName, lastName);

      console.log("Result " + result);

      expect(mockRedis.set).toHaveBeenCalledWith(email, expect.any(String), 'EX', 24 * 60 * 60);
      expect(result.status).toBe('success');
      expect(result.message).toBe("Registration successful. Please check your email for the OTP.");
    });

    it('should throw an error if registration fails', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const firstName = 'test';
      const lastName = 'test';

      mockRedis.set.mockRejectedValue(new Error('Redis error'));

      await expect(authService.register(email, password, firstName, lastName)).rejects.toThrow('Redis error');
    });
  });

  describe('verify', () => {
    it('should verify a user', async () => {
      const otp = '123456';
      const email = 'test@test.com';

      const mockUser = new User();
      mockUser.email = email;

      mockRedis.get.mockResolvedValue(JSON.stringify({ otp }));
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await authService.verify(email, otp);

      expect(mockRedis.get).toHaveBeenCalledWith(email);
      expect(mockRedis.del).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email, password: undefined, salt: undefined, firstName: undefined, lastName: undefined, products: [{
          dataSource: "zarc",
          key: null,
          tou: "public",
        },
        {
          dataSource: "africa",
          key: null,
          tou: "public",
        },
        {
          dataSource: "ryce",
          key: null,
          tou: "public",
        },
        ]
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result.status).toBe('success');
      expect(result.message).toBe('Verification successful.');
    });

    it('should throw an error if verification fails', async () => {
      const email = 'test@test.com';
      const otp = '123456';

      mockRedis.get.mockResolvedValue(null);

      const result = await authService.verify(email, otp);
      expect(result.status).toBe(400);
      expect(result.message).toBe(`Email has not been found.`);
    });
  });

  describe('resendOTP', () => {
    it('should resend an OTP', async () => {
      const email = 'test@test.com';
      const otp = '123456';
      const userPayload = JSON.stringify({ otp });

      mockRedis.get.mockResolvedValue(userPayload);
      mockRedis.set.mockResolvedValue('OK');
      jest.spyOn(authService, 'sendOTPEmail').mockResolvedValue();

      const result = await authService.resendOTP(email);

      expect(mockRedis.get).toHaveBeenCalledWith(email);
      expect(result.status).toBe('success');
      expect(result.message).toBe('Registration successful. Please check your email for the OTP.');
    });

    it('should throw an error if resending OTP fails', async () => {
      const email = 'test@test.com';

      mockRedis.get.mockResolvedValue(null);

      const result = await authService.resendOTP(email);

      expect(result.status).toBe(400);
      expect(result.message).toBe('Could not find this email, please regsiter');
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockUser = new User();
      mockUser.email = email;
      mockUser.salt = salt;
      mockUser.password = hashedPassword;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.login(email, password);
      expect(result.status).toBe('success');
      expect(result.userWithToken.token).toBe('mockJwtToken');
    });

    it('should throw an error if login fails', async () => {
      const email = 'test@test.com';
      const password = 'password';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await authService.login(email, password);
      expect(result.status).toBe(400);
      expect(result.message).toBe('This user does not exist, please enter the correct email/please register.');

    });
  });

  describe('getUserInfo', () => {
    it('should return error when user payload is not retrieved from Redis', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await authService.getUserInfo('invalidToken');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'Invalid token.',
        timestamp: expect.any(String),
      });
    });

    it('should return error when user does not exist', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(undefined);
      const result = await authService.getUserInfo('token');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'User does not exist.',
        timestamp: expect.any(String),
      });
    });

    it('should return the user info successfully', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.email = 'test@test.com';
      mockUser.firstName = 'firstName';
      mockUser.lastName = 'lastName';
      mockUser.salt = 'salt';
      mockUser.products = [];
      mockUser.userGroups = [];
      mockUser.organisationId = 1;
      mockUser.organisation = null;
      mockUser.dashboards = [];

      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRedis.set.mockResolvedValue('OK');
      const result = await authService.getUserInfo('token');
      expect(result).toEqual({
        status: 'success',
        message: expect.any(User),
        timestamp: expect.any(String),
      });
    });
  });

  describe('createAPIKey', () => {
    it('should return error when user payload is not retrieved from Redis', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await authService.createAPIKey('invalidToken');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'Invalid token',
        timestamp: expect.any(String),
      });
    });

    it('should return error when user does not exist', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(undefined);
      const result = await authService.createAPIKey('token');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'User not found',
        timestamp: expect.any(String),
      });
    });

    it('should return error when user already has an API key', async () => {
      const mockUser = new User();
      mockUser.apiKey = 'existingAPIKey';
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await authService.createAPIKey('token');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'User already has an api key',
        timestamp: expect.any(String),
      });
    });

    it('should create a new API key successfully', async () => {
      const mockUser = new User();
      mockUser.apiKey = null;
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRedis.set.mockResolvedValue('OK');
      mockUserRepository.save.mockResolvedValue(mockUser);
      const result = await authService.createAPIKey('token');
      expect(result).toEqual({
        status: 'success',
        message: expect.any(String),
        timestamp: expect.any(String),
      });
    });
  });

  describe('checkUserAPIKey', () => {
    it('should return error when user payload is not retrieved from Redis', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await authService.checkUserAPIKey('invalidToken');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'Invalid token',
        timestamp: expect.any(String),
      });
    });

    it('should return error when user does not exist', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(undefined);
      const result = await authService.checkUserAPIKey('token');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'User to be removed not found',
        timestamp: expect.any(String),
      });
    });

    it('should return success status with false message when user does not have an API key', async () => {
      const mockUser = new User();
      mockUser.apiKey = null;
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await authService.checkUserAPIKey('token');
      expect(result).toEqual({
        status: 'success',
        message: false,
        timestamp: expect.any(String),
      });
    });

    it('should return success status with true message when user has an API key', async () => {
      const mockUser = new User();
      mockUser.apiKey = 'existingAPIKey';
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await authService.checkUserAPIKey('token');
      expect(result).toEqual({
        status: 'success',
        message: true,
        timestamp: expect.any(String),
      });
    });
  });

  describe('rerollAPIKey', () => {
    it('should return error when user payload is not retrieved from Redis', async () => {
      mockRedis.get.mockResolvedValue(null);
      const result = await authService.rerollAPIKey('invalidToken');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'Invalid token',
        timestamp: expect.any(String),
      });
    });

    it('should return error when user does not exist', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(undefined);
      const result = await authService.rerollAPIKey('token');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'User not found',
        timestamp: expect.any(String),
      });
    });

    it('should return error when the user\'s api key matches the token', async () => {
      const token = 'existingAPIKey';
      const mockUser = new User();
      mockUser.apiKey = token;
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await authService.rerollAPIKey(token);
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'Please enter JWT token',
        timestamp: expect.any(String),
      });
    });

    it('should return error when user does not have an API key', async () => {
      const mockUser = new User();
      mockUser.apiKey = null;
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await authService.rerollAPIKey('token');
      expect(result).toEqual({
        status: 400,
        error: true,
        message: 'User does not have an API key',
        timestamp: expect.any(String),
      });
    });

    it('should return success when user\'s api key is rerolled', async () => {
      const token = 'existingAPIKey';
      const mockUser = new User();
      mockUser.apiKey = token;
      mockRedis.get.mockResolvedValue(JSON.stringify({ email: 'test@test.com' }));
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockRedis.set.mockResolvedValue('OK');
      mockRedis.del.mockResolvedValue(1);
      const result = await authService.rerollAPIKey('jwtToken');
      expect(result.status).toBe('success');
      expect(result.message).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

});
