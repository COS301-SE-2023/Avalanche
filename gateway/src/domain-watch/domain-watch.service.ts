/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DomainWatchService {
  constructor(private httpService: HttpService) { }

  async sendData(data: any): Promise<any> {
    console.log(data);
    const response = this.httpService.post('http://zanet.cloud:4004/domainWatch/list', data);
    const responseData = await lastValueFrom(response);
    return JSON.stringify(responseData.data);
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async passive() {
    console.log('Running every day at midnight');
    const userData  = await this.httpService.post('http://localhost:4000/user-management/getDomainWatchPassive').toPromise();
    const userInfo = userData.data.watched;
    const africaData = await this.httpService.post('http://localhost:4000/africa/domainWatchPassive').toPromise();
    const africaInfo = africaData.data.queryData[0]['DOMAINWATCHPASSIVE'];
    const data = {'watched' : userInfo, 'recently-created' : africaInfo};
    const response = await this.httpService.post('http://zanet.cloud:4004/domainWatch/passive', data).toPromise();
    return JSON.stringify(response);
  }
}

