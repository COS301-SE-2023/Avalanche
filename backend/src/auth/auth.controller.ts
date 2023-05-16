/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    if (!username || !password) {
      throw new HttpException(
        'Username and password are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.authService.registerUser(username, password);
      return { success: true, user: { id: user.id, username: user.username } };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message };
    }
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException(
        'Invalid username or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { username: user.username, sub: user.id };
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
    };
  }
}
