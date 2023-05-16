/* eslint-disable prettier/prettier */
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';
import { CacheUserService } from '../redisUser/cacheUser.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
    private userService: UserService,
    private cacheService: CacheUserService,
  ) {}

  async login(user: any) {
    // TODO: Implement your logic
  }
  async forgotPassword(user: any) {
    // TODO: Implement your logic
  }

  async verifyOtp(user: any, otp: string) {
    // TODO: Implement your logic
  }
  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    userDto.password = hashedPassword;

    const user = await this.userService.create(userDto);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to Redis with a TTL of 24 hours
    await this.cacheService.set(user.email, {otp: otp, ttl: 60 * 60 * 24 });

    // Send OTP to user's email
    await this.emailService.sendEmail(
      user.email,
      'Verify your email',
      `Your one-time pin is ${otp}. It will expire in 24 hours.`,
    );

    return user;
  }
}
