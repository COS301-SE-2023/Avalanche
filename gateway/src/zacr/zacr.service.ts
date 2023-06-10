/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ZacrService {
  constructor(
    @Inject('ZACR_SERVICE') private readonly client: ClientProxy,
  ) {}

  async transactions(data: any) {
    console.log("boiii");
    return this.client.send({ cmd: 'transactions' }, data).toPromise();
  }
}