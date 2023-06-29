/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DomainNameAnalysisService {
  constructor(private httpService: HttpService) { }

  async sendData(data: any): Promise<any> {
    console.log(data);
    const response = this.httpService.post('http://zanet.cloud:4005/domainNameAnalysis/list', data);
    const responseData = await lastValueFrom(response);
    return JSON.stringify(responseData.data);
  }
}