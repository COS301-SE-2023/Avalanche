/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

@Injectable()
export class DomainNameAnalysisService {
  constructor(private httpService: HttpService, private readonly snowflakeService: SnowflakeService) { }

  async sendData(data: any): Promise<any> {
    console.log(data);
    const jsonInput = JSON.stringify(data.jsonInput);
    console.log(jsonInput);
    const sqlQuery = `call domainNameAnalysis('${jsonInput}')`;
    console.log(sqlQuery);
    const queryData = await this.snowflakeService.execute(sqlQuery);
    console.log(queryData[0]['DOMAINNAMEANALYSIS']);
    data.data = queryData[0]['DOMAINNAMEANALYSIS'];
    delete data.jsonInput;
    const response = this.httpService.post('http://zanet.cloud:4005/domainNameAnalysis/list', data);
    const responseData = await lastValueFrom(response);
    return JSON.stringify(responseData.data);
  }
}