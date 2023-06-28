/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ZacrService {
  constructor(
    @Inject('ZACR_SERVICE') private readonly client: ClientProxy,
  ) {}

  async transactions(data: any) {
    return this.client.send({ cmd: 'transactions' }, data).toPromise();
  }

  async marketShare(data: any) {
    return this.client.send({ cmd: 'marketShare' }, data).toPromise();
  }

  async age(data: any) {
    return this.client.send({ cmd: 'age' }, data).toPromise();
  }
}