/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';

// Mock Redis
jest.mock('ioredis', () => ({
  // Mock constructor
  default: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('nodemailer');
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let redisMock: jest.Mocked<Redis>;
  let mailer: typeof nodemailer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'REDIS', useClass: Redis },  // Using useClass here to refer to the mocked class
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    redisMock = module.get('REDIS');
    mailer = nodemailer as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const testEmail = 'test@test.com';
    const testPassword = 'password123';
    const otp = '100000'; // This should match the mocked OTP
  
    it('should hash password, save data in Redis, and send email', async () => {
      const hashedPassword = 'hashedpassword';
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); 
      bcrypt.hash.mockResolvedValue(hashedPassword);
      redisMock.set.mockResolvedValue('OK');
      redisMock.get.mockResolvedValue(JSON.stringify({ password: hashedPassword, otp }));
      mailer.createTransport = jest.fn().mockReturnValue({ sendMail: jest.fn().mockResolvedValue({}) });
  
      await service.register(testEmail, testPassword);
  
      expect(bcrypt.hash).toHaveBeenCalledTimes(2);
      expect(redisMock.set).toHaveBeenCalledWith(
        testEmail,
        JSON.stringify({ password: hashedPassword, otp }),
        'EX',
        24 * 60 * 60
      );
      expect(redisMock.get).toHaveBeenCalledWith(testEmail);
      expect(mailer.createTransport().sendMail).toHaveBeenCalledWith({
        from: '"Avalanche" <theskunkworks301@gmail.com>',
        to: testEmail,
        subject: 'OTP for registration',
        text: `Your OTP is ${otp}`,
        html: `<b>Your OTP is ${otp}</b>`,
      });
    });
  });  
});
