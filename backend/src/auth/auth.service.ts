/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,) { }

  async register(email: string, password: string) {
    const saltRounds = 10;
    const firstHash = await bcrypt.hash(password, saltRounds);
    const doubleHashedPassword = await bcrypt.hash(firstHash, saltRounds);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user's email, password, and OTP to Redis
    const userData = JSON.stringify({ password: doubleHashedPassword, email: email });
    await this.redis.set(otp, userData, 'EX', 24 * 60 * 60);

    // Retrieve the data from Redis to verify it was saved correctly
    const savedData = await this.redis.get(email);
    console.log(savedData);

    // Send email with OTP link
    await this.sendOTPEmail(email, otp);

    return { status: 'success', message: 'Registration successful. Please check your email for the OTP.' };
  }

  async sendOTPEmail(email: string, otp: string) {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'theskunkworks301@gmail.com', 
        pass: this.configService.get('GOOGLE_PASSWORD'),
      },
    });

    const otpHtmlTemplate = readFileSync(join(__dirname,'../../src/auth/otp-email-template.html'), 'utf-8');
    const otpHtml = otpHtmlTemplate.replace('{OTP}', otp);

    // Send email
    const info = await transporter.sendMail({
      from: '"Avalanche Analytics" <theskunkworks301@gmail.com>', 
      to: email,
      subject: 'OTP for Avalanche Analytics registration',
      text: `Hi, \nThank you for choosing Avalanche. Your OTP is ${otp} and will be valid for 24 hours\nRegards,\nAvalanche team`,
      html: otpHtml,
    });

    console.log('Message sent: %s', info.messageId);
  }

  async verify(email: string, otp: string) {
    // Get user's info from Redis
    const userInfo = await this.redis.get(email);
    if (!userInfo) throw new Error('Invalid OTP');

    const { password, otp: savedOtp } = JSON.parse(userInfo);
    if (otp !== savedOtp) throw new Error('Invalid OTP');

    // Save user's information to PostgreSQL
    const user = this.userRepository.create({ email, password, integrations: null, organisations: null, userGroups: null });
    await this.userRepository.save(user);

    // Remove user's information from Redis
    await this.redis.del(email);

    return { status: 'success', message: 'Verification successful.' };
  }

  // async verify(email: string, otp: string) {
  //   // Get user's info from Redis
  //   const client = this.redisService.getClient();
  //   const userInfo = await client.get(email);
  //   if (!userInfo) throw new Error('Invalid OTP');

  //   const { password, otp: savedOtp } = JSON.parse(userInfo);
  //   if (otp !== savedOtp) throw new Error('Invalid OTP');

  //   // Save user's information to PostgreSQL
  //   const user = this.usersRepository.create({ email, password });
  //   await this.usersRepository.save(user);

  //   // Remove user's information from Redis
  //   await client.del(email);
  // }
}
