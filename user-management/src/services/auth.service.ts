/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,) { }

  async register(email: string, password: string, firstName: string, lastName: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const firstHash = await bcrypt.hash(password, salt);
    const doubleHashedPassword = await bcrypt.hash(firstHash, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user's email, password, and OTP to Redis
    const userData = JSON.stringify({ password: doubleHashedPassword, otp: otp, salt: salt, firstName : firstName, lastName: lastName });
    await this.redis.set(email, userData, 'EX', 24 * 60 * 60);

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

    const otpHtmlTemplate = readFileSync(join(__dirname, '../../user-management/src/otp-email-template.html'), 'utf-8');
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

    const { password, salt, firstName, lastName, otp: savedOtp } = JSON.parse(userInfo);
    console.log(password + " " + otp);
    if (otp !== savedOtp) throw new Error('Invalid OTP');

    // Save user's information to PostgreSQL
    const user = this.userRepository.create({ email, password, salt, firstName, lastName});
    console.log(user);
    const check = await this.userRepository.save(user);
    console.log(check);

    // Remove user's information from Redis
    await this.redis.del(email);

    return { status: 'success', message: 'Verification successful.' };
  }

  async login(email: string, passwordLogin: string) {
    // Fetch user from the PostgreSQL database
    const user = await this.userRepository.findOne({ where: { email } });

    // If user not found, throw error
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the provided password with the user's hashed password in the database
    const saltFromDB = user.salt;
    passwordLogin = await bcrypt.hash(passwordLogin, saltFromDB);
    passwordLogin = await bcrypt.hash(passwordLogin, saltFromDB);

    const passwordIsValid = await bcrypt.compare(passwordLogin, user.password);

    // If the password isn't valid, throw error
    if (passwordIsValid) {
      throw new Error('Invalid password');
    }

    // Create JWT token with user's email as payload
    const jwtToken = this.jwtService.sign({ email: user.email });

    // If the password is valid, store jwt token and user's information in Redis
    // We exclude password and salt field here for security reasons
    const { password, salt, ...userWithoutPassword } = user;
    const userWithToken = { ...userWithoutPassword, token: jwtToken};
    await this.redis.set(jwtToken, JSON.stringify(userWithToken), 'EX', 24 * 60 * 60);

    // Send back user's information along with the token as a JSON object
    return userWithToken;
  }

}

