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
import { check } from 'prettier';
@Injectable()
export class AuthService {
  constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,) { }

  async register(email: string, password: string, firstName: string, lastName: string) {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['userGroups', 'organisation'] });
    if (!user) {
      const checkRedis = await this.redis.get(email);
      if (!checkRedis) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const firstHash = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save user's email, password, and OTP to Redis
        const userData = JSON.stringify({ password: firstHash, otp: otp, salt: salt, firstName: firstName, lastName: lastName });
        await this.redis.set(email, userData, 'EX', 24 * 60 * 60);

        // Retrieve the data from Redis to verify it was saved correctly
        const savedData = await this.redis.get(email);
        console.log(savedData);

        // Send email with OTP link
        await this.sendOTPEmail(email, otp);

        return { status: 'success', message: 'Registration successful. Please check your email for the OTP.' };
      } else {
        return { status: 'failure', message: 'Registration unsuccessful. Email is awaiting verification.' };
      }
    } else {
      return { status: 'failure', message: 'Registration unsuccessful. This email is in use.' };
    }
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

    const otpHtmlTemplate = readFileSync(join(__dirname, '../../src/html/otp-email-template.html'), 'utf-8');
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
    if (!userInfo) {
      return { status: 'failure', message: 'Email has not been found.' };
    };

    const { password, salt, firstName, lastName, otp: savedOtp } = JSON.parse(userInfo);
    console.log(password + " " + otp);
    if (otp !== savedOtp) {
      return { status: 'failure', message: 'Incorrect OTP.' };
    };

    // Save user's information to PostgreSQL
    const user = this.userRepository.create({ email, password, salt, firstName, lastName });
    console.log(user);
    const check = await this.userRepository.save(user);
    console.log(check);

    // Remove user's information from Redis
    await this.redis.del(email);

    return { status: 'success', message: 'Verification successful.' };
  }

  async login(email: string, passwordLogin: string) {
    // Fetch user from the PostgreSQL database
    const user = await this.userRepository.findOne({ where: { email }, relations: ['userGroups', 'organisation'] });
    console.log(user);
    // If user not found, throw error
    if (!user) {
      return { status: 'failure', message: 'This user does not exist, please enter the correct email/please register.' };
    }

    // Verify the provided password with the user's hashed password in the database
    const saltFromDB = user.salt;
    const passwordLogin1 = await bcrypt.hash(passwordLogin, saltFromDB);
    let passwordIsValid = false;
    if(passwordLogin1 === user.password){
      passwordIsValid = true;
    }
    console.log(user.password);
    console.log(passwordLogin1);

    // If the password isn't valid, throw error
    if (!passwordIsValid) {
      return { status: 'failure', message: 'Incorrect password' };
    }

    // Create JWT token with user's email as payload
    const jwtToken = this.jwtService.sign({ email: user.email });

    // If the password is valid, store jwt token and user's information in Redis
    // We exclude password and salt field here for security reasons
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, salt, ...userWithoutPassword } = user;
    const userWithToken = { ...userWithoutPassword, token: jwtToken };
    await this.redis.set(jwtToken, JSON.stringify(userWithToken), 'EX', 24 * 60 * 60);

    // Send back user's information along with the token as a JSON object
    return {status: "success", userWithToken};
  }

}

