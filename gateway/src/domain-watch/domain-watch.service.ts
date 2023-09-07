import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as whois from 'node-whois';

@Injectable()
export class DomainWatchService {
  constructor(private httpService: HttpService) { }

  async sendData(data: any): Promise<any> {
    try {
      const response = this.httpService.post(
        'http://zanet.cloud:4100/domainWatch/active',
        data,
      );
      const responseData = await lastValueFrom(response);
      return JSON.stringify(responseData.data);
    } catch (error) {
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async passive() {
    console.log('Running every day at midnight');
    const userData = await this.httpService
      .post('http://gateway:4000/user-management/getDomainWatchPassive')
      .toPromise();
    const userInfo = userData.data.watched;
    const africaData = await this.httpService
      .post('http://gateway:4000/africa/domainWatchPassive')
      .toPromise();
    const africaInfo = africaData.data.queryData[0]['DOMAINWATCHPASSIVE'];
    const check = { watched: userInfo, 'recently-created': africaInfo };
    const response = await this.httpService
      .post('http://DomainWatch:4100/domainWatch/passive', check)
      .toPromise();
    return JSON.stringify(response.data);
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async loadDomains() {
    console.log('Running every day');
    const africaData = await this.httpService
      .post('http://gateway:4000/africa/loadDomains')
      .toPromise();
    const africaInfo = africaData.data.queryData[0]['LOADDOMAINS'];
    const zacrData = await this.httpService
      .post('http://gateway:4000/zacr/loadDomains')
      .toPromise();
    const zacrInfo = zacrData.data.queryData[0]['LOADDOMAINS'];
    const ryceData = await this.httpService
      .post('http://gateway:4000/africa/loadDomains')
      .toPromise();
    const ryceInfo = ryceData.data.queryData[0]['LOADDOMAINS'];
    const check = {
      registryDomains: [
        { registryName: 'AFRICA_Domains', domains: africaInfo },
        { registryName: 'ZACR_Domains', domains: zacrInfo },
        { registryName: 'RYCE_Domains', domains: ryceInfo },
      ],
    };
    const response = await this.httpService
      .post('http://DomainWatch:4100/domainWatch/loadDomains', check)
      .toPromise();
    return JSON.stringify(response.data);
  }

  async whoisyou(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      whois.lookup(data.domain, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve({ "data": data });
        }
      });
    });
  }
}
