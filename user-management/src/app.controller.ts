/* eslint-disable prettier/prettier */
import { Controller} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './services/user-management.service';

@Controller('user-management')
export class AppController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    console.log("Registering user: ", data);
    return await this.authService.register(data.email, data.password, data.firstName, data.lastName);
  }

  @MessagePattern({ cmd: 'verify' })
  async verify(data: any) {
    console.log("Verifying user: ", data);
    return await this.authService.verify(data.email, data.otp);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: any) {
    console.log("Logging in user: ", data);
    return await this.authService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: 'createOrganisation' })
  async createOrganisation(data: any) {
    console.log("Creating organisation: ", data);
    return await this.userService.createOrganisation(data.request, data.name);
  }
}
