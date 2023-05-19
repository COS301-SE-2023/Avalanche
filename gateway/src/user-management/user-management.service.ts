/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject('USER_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async register(data: any) {
    console.log("In register");
    return this.client.send({ cmd: 'register' }, data).toPromise();
  }

  async verify(data: any) {
    return this.client.send({ cmd: 'verify' }, data).toPromise();
  }

  async login(data: any) {
    return this.client.send({ cmd: 'login' }, data).toPromise();
  }
}
