/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DomainWatchService {
  constructor(private httpService: HttpService) { }

  async sendData(data: any): Promise<any> {
    const response = this.httpService.post('http://zanet.cloud:4004/domainWatch/list', data);
    const responseData = await lastValueFrom(response);
    return JSON.stringify(responseData.data);
  }
}

