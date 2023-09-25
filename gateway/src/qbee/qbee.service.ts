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
    const sqlQuery = await this.client.send({ cmd: 'qbee' }, data).toPromise();
    const response = await this.httpService
      .post('http://localhost:4000/zacr/qbee', sqlQuery)
      .toPromise();
    return response.data;

  }

  async getSchema(data: any){
    return this.client.send({ cmd: 'getSchema' }, data).toPromise();
  }
}