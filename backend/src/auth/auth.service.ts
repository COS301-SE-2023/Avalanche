/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
@Injectable()
export class AuthService {
  constructor(@Inject('REDIS') private readonly redis: Redis) { }

  async register(email: string, password: string) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user's email, password, and OTP to Redis
    await this.redis.set(email, JSON.stringify({ password, otp }), 'EX', 24 * 60 * 60);

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
      service: 'gmail', // Replace with your email service
      auth: {
        user: 'theskunkworks301@gmail.com', // Replace with your email
        pass: 'snlfvyltleqsmmxg', // Replace with your password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: '"Your App" <theskunkworks301@gmail.com>', // Replace with your email
      to: email,
      subject: 'OTP for registration',
      text: `Your OTP is ${otp}`,
      html: `<b>Your OTP is ${otp}</b>`,
    });

    console.log('Message sent: %s', info.messageId);
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
