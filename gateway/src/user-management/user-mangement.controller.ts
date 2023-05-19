/* eslint-disable prettier/prettier */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('user-management')
export class UserManagementController {
  constructor(@Inject('USER_MANAGEMENT_SERVICE') private client: ClientProxy) {}

  @Post('register')
  async register(@Body() data: any) {
    const pattern = { cmd: 'register' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }
  @Post('verify')
  async verify(@Body() data: any) {
    const pattern = { cmd: 'verify' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }
  @Post('login')
  async login(@Body() data: any) {
    const pattern = { cmd: 'login' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }
  @Post('createOrganisation')
  async createOrganisation(@Body() data: any) {
    const pattern = { cmd: 'createOrganisation' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }
}
