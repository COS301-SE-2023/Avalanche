/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response, response } from 'express';
@Injectable()
export class AuthService {
  constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService) { }

  async register(email: string, password: string, firstName: string, lastName: string) {
    if (!email || !password || !firstName || !lastName) {
      return {
        status: 400, error: true, message: "Missing info",
        timestamp: new Date().toISOString()
      }
    }
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

        return {
          status: 'success', message: 'Registration successful. Please check your email for the OTP.',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 400, error: true, message: 'Registration unsuccessful. Email is awaiting verification.',
          timestamp: new Date().toISOString()
        };
      }
    } else {
      return {
        status: 400, error: true, message: 'Registration unsuccessful. This email is in use.',
        timestamp: new Date().toISOString()
      };
    }
  }

  async resendOTP(email: string) {
    const userPayload = await this.redis.get(email);
    if (!userPayload) {
      return {
        status: 400, error: true, message: 'Could not find this email, please regsiter',
        timestamp: new Date().toISOString()
      };
    }
    const user = JSON.parse(userPayload);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await this.redis.set(email, user, 'EX', 24 * 60 * 60);
    await this.sendOTPEmail(email, otp);
    return {
      status: 'success', message: 'Registration successful. Please check your email for the OTP.',
      timestamp: new Date().toISOString()
    };
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

    const otpHtmlTemplate = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:300px;max-width:1000px;overflow:auto;line-height:2;margin: 0 auto;">
    <div style="margin:20px auto;width:90%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #007aff;text-decoration:none;font-weight:600">Avalanche Analytics</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Avalanche. Use the following OTP to complete your Sign Up procedures. OTP is valid for 24 hours</p>
      <h2 style="background: #007aff;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">{OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />Avalanche Team</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300;text-align: center;">
        <p>Avalanche</p>
        <p>DNS Business</p>
        <p>2023</p>
      </div>
    </div>
  </div>`;
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
      return {
        status: 400, error: true, message: 'Email has not been found.',
        timestamp: new Date().toISOString()
      };
    };

    const { password, salt, firstName, lastName, otp: savedOtp } = JSON.parse(userInfo);
    console.log(password + " " + otp);
    if (otp !== savedOtp) {
      return {
        status: 400, error: true, message: 'Incorrect OTP.',
        timestamp: new Date().toISOString()
      };
    };

    // Save user's information to PostgreSQL
    const user = this.userRepository.create({ email, password, salt, firstName, lastName });
    console.log(user);
    const check = await this.userRepository.save(user);
    console.log(check);

    // Remove user's information from Redis
    await this.redis.del(email);

    return {
      status: 'success', message: 'Verification successful.',
      timestamp: new Date().toISOString()
    };
  }

  async login(email: string, passwordLogin: string) {
    // Fetch user from the PostgreSQL database
    const user = await this.userRepository.findOne({ where: { email }, relations: ['userGroups', 'organisation', 'dashboards'] });
    console.log(user);

    // If user not found, throw error
    if (!user) {
      return {
        status: 400, error: true, message: 'This user does not exist, please enter the correct email/please register.',
        timestamp: new Date().toISOString()
      };
    }
    delete user.apiKey;
    // Verify the provided password with the user's hashed password in the database
    const saltFromDB = user.salt;
    const passwordLogin1 = await bcrypt.hash(passwordLogin, saltFromDB);
    let passwordIsValid = false;
    if (passwordLogin1 === user.password) {
      passwordIsValid = true;
    }
    console.log(user.password);
    console.log(passwordLogin1);

    // If the password isn't valid, throw error
    if (!passwordIsValid) {
      return {
        status: 400,
        error: true,
        message: 'Incorrect password',
        timestamp: new Date().toISOString()
      };
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
    return {
      status: "success", userWithToken,
      timestamp: new Date().toISOString()
    };
  }

  async getUserInfo(token: string) {
    // Extract the JWT token
    // Retrieve the user's information from Redis using the token
    const userPayload = await this.redis.get(token);
    if (!userPayload) {
      return {
        status: 400, error: true, message: 'Invalid token.',
        timestamp: new Date().toISOString()
      };
    }
    const { email: userEmail } = JSON.parse(userPayload);
    console.log(userEmail);
    const user = await this.userRepository.findOne({
      where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'],
      select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'dashboards']
    });
    if (!user) {
      return {
        status: 400, error: true, message: 'User does not exist.',
        timestamp: new Date().toISOString()
      };
    }
    delete user.salt;
    // Update the user's information in Redis
    await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);

    return {
      status: 'success', message: user,
      timestamp: new Date().toISOString()
    };
  }

  async createAPIKey(token: string) {
    console.log("elo");
    const userData = await this.redis.get(token);
    if (!userData) {
      return {
        status: 400, error: true, message: 'Invalid token',
        timestamp: new Date().toISOString()
      };
    }
    const userDetails = JSON.parse(userData);

    const user = await this.userRepository.findOne({ where: { email: userDetails.email }, relations: ['userGroups', 'organisation'], select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'apiKey'] });
    if (!user) {
      return {
        status: 400, error: true, message: 'User not found',
        timestamp: new Date().toISOString()
      };
    }

    // console.log(user);
    // console.log(user['apiKey']);

    if (user['apiKey']?.length > 0 || user['apiKey']) {
      return {
        status: 400, error: true, message: 'User already has an api key',
        timestamp: new Date().toISOString()
      };
    }

    const jwtToken = uuidv4();
    user.apiKey = jwtToken;
    await this.userRepository.save(user);
    delete user.apiKey;
    await this.redis.set(jwtToken, JSON.stringify(user));
    const userWithToken = { ...user, apiKey: jwtToken };
    // Send back user's information along with the token as a JSON object
    return {
      status: "success", message: userWithToken.apiKey,
      timestamp: new Date().toISOString()
    };
  }

  async checkUserAPIKey(token: string) {
    const userData = await this.redis.get(token);
    if (!userData) {
      return {
        status: 400, error: true, message: 'Invalid token',
        timestamp: new Date().toISOString()
      };
    }
    const userDetails = JSON.parse(userData);

    const user = await this.userRepository.findOne({ where: { email: userDetails.email }, relations: ['userGroups', 'organisation'], select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'apiKey'] });
    if (!user) {
      return {
        status: 400, error: true, message: 'User to be removed not found',
        timestamp: new Date().toISOString()
      };
    }
    if (!user.apiKey) {
      return {
        status: "success", message: false,
        timestamp: new Date().toISOString()
      }
    } else {
      return {
        status: "success", message: true,
        timestamp: new Date().toISOString()
      }
    }
  }

  async rerollAPIKey(token: string) {
    const userData = await this.redis.get(token);
    if (!userData) {
      return {
        status: 400, error: true, message: 'Invalid token',
        timestamp: new Date().toISOString()
      };
    }
    const userDetails = JSON.parse(userData);

    const user = await this.userRepository.findOne({ where: { email: userDetails.email }, relations: ['userGroups', 'organisation'], select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'apiKey'] });
    if (!user) {
      return {
        status: 400, error: true, message: 'User not found',
        timestamp: new Date().toISOString()
      };
    }

    console.log(user);

    // reroll your api key with an api key check
    if (user['apiKey'] == token) {
      return {
        status: 400, error: true, message: 'Please enter JWT token',
        timestamp: new Date().toISOString()
      };
    }

    console.log(user);

    if (!user['apiKey']) {
      return {
        status: 400, error: true, message: 'User does not have an API key',
        timestamp: new Date().toISOString()
      };
    }
    const tempApi = user.apiKey;
    const jwtToken = uuidv4();
    user.apiKey = jwtToken;
    await this.userRepository.save(user);
    delete user.apiKey;
    delete user.salt;
    await this.redis.set(jwtToken, JSON.stringify(user));
    await this.redis.del(tempApi);
    // await this.redis.del(token);
    const userWithToken = { ...user, apiKey: jwtToken };
    // Send back user's information along with the token as a JSON object
    return {
      status: "success", message: userWithToken.apiKey,
      timestamp: new Date().toISOString()
    };
  }
}

