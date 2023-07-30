import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class DomainWatchService {
  constructor(
    private httpService: HttpService,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async passive(): Promise<any> {
    const sqlQuery = `call domainWatchPassive('')`;
    let queryData;
    try {
      queryData = await this.snowflakeService.execute(sqlQuery);
    } catch (e) {
      return {
        status: 500,
        error: true,
        message: 'Data Warehouse Error',
        timestamp: new Date().toISOString(),
      };
    }
    console.log(queryData);
    return { queryData };
  }

  async loadDomains(): Promise<any> {
    const sqlQuery = `call loadDomains()`;
    let queryData;
    try {
      queryData = await this.snowflakeService.execute(sqlQuery);
    } catch (e) {
      return {
        status: 500,
        error: true,
        message: 'Data Warehouse Error',
        timestamp: new Date().toISOString(),
      };
    }
    console.log(queryData);
    return { queryData };
  }
}
