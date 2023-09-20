/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class QbeeService {
  constructor(
    @Inject('QBEE_SERVICE') private readonly client: ClientProxy,
    private httpService: HttpService
  ) {}

  async zarc(data: any) {
    const query = await this.client.send({ cmd: 'qbee' }, data).toPromise();
    const response = await this.httpService
      .post('http://gateway:4000/zarc/qbee', query)
      .toPromise();
    return response;

  }
}