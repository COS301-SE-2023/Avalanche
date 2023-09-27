import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as whois from 'node-whois';
import * as nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
@Injectable()
export class DomainWatchService {
  constructor(private httpService: HttpService) { }

  async sendData(data: any): Promise<any> {
    try {
      const response = this.httpService.post(
        'http://DomainWatch:4100/domainWatch/active',
        data,
      );
      const responseData = await lastValueFrom(response);
      return JSON.stringify(responseData.data);
    } catch (error) {
      throw error;
    }
  }

  async takePickeeNow(data: any): Promise<any> {
    try {
      const response = this.httpService.post(
        'http://DomainWatch:4100/domainWatch/takePickeeNow',
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
    const emailInfo = userData.data.emailData;
    const africaData = await this.httpService
      .post('http://gateway:4000/africa/domainWatchPassive')
      .toPromise();
    const africaInfo = africaData.data.queryData[0]['DOMAINWATCHPASSIVE'];
    const zarcData = await this.httpService
      .post('http://gateway:4000/zacr/domainWatchPassive')
      .toPromise();
    const zarcInfo = zarcData.data.queryData[0]['DOMAINWATCHPASSIVE'];
    const info = zarcInfo + africaInfo;
    const check = { watched: userInfo, 'recently-created': info };
    const response = await this.httpService
      .post('http://DomainWatch:4100/domainWatch/passive', check)
      .toPromise();
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'theskunkworks301@gmail.com',
        pass: process.env.GOOGLE_PASSWORD,
      }
    });

    // Loop through each alert in the response
    for (const alert of response.data.alerts) {
      // Find the corresponding emailInfo for each person
      const personEmailInfos = emailInfo.filter(info => info.person === alert.person);

      // If a matching emailInfo is found, send the email
      for (const personEmailInfo of personEmailInfos) {
        const { email, person } = personEmailInfo;
        const domains = alert.domains;

        // Create email body
        let emailBody = `Hello ${person},\n\nHere are your domains:\n`;
        for (const domain of domains) {
          emailBody += `- ${domain}\n`;
        }

        // Send the email
        await transporter.sendMail({
          from: 'Avalanche Analytics',
          to: email,
          subject: `Domain Alert for ${person}`,
          text: emailBody
        });
      }
    }
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
