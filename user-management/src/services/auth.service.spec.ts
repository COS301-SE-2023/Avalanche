/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
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
          provide: getRepositoryToken(User),
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
    mockUserRepository = module.get(getRepositoryToken(User));
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
      expect(mockUserRepository.create).toHaveBeenCalledWith({ email, password: undefined, salt: undefined, firstName: undefined, lastName: undefined });
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
});
