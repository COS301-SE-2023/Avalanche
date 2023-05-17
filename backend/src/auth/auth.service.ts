/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class AuthService {
  constructor(@Inject('REDIS') private readonly redis: Redis) { }

  async register(email: string, password: string) {
    console.log("here");
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user's email, password, and OTP to Redis
    await this.redis.set(email, JSON.stringify({ password, otp }), 'EX', 24 * 60 * 60);

    // Retrieve the data from Redis to verify it was saved correctly
    const savedData = await this.redis.get(email);
    console.log(savedData);
    return { status: 'success', message: 'Registration successful. Please check your email for the OTP.' };
    // Send email with OTP link
    // Implement email sending functionality
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
