/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string) {
    const result = await this.authService.register(email, password);
    return result;
  }

  // @Post('verify')
  // async verify(@Body('email') email: string, @Body('otp') otp: string) {
  //   return this.authService.verify(email, otp);
  // }
}
