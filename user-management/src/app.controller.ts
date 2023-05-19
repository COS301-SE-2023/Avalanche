/* eslint-disable prettier/prettier */
import { Controller} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user-management')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    return this.appService.register(data.email, data.password, data.firstName, data.lastName);
  }

  @MessagePattern({ cmd: 'verify' })
  async verify(data: any) {
    return this.appService.verify(data.email, data.otp);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: any) {
    return this.appService.login(data.email, data.password);
  }
}
