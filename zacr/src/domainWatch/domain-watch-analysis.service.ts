import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { GraphFormatService } from 'src/graph-format/graph-format.service';

@Injectable()
export class DomainWatchService {
  constructor(
    private httpService: HttpService,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async passive(): Promise<any> {
    const sqlQuery = `call domainWatchPassive('')`;
    const queryData = await this.snowflakeService.execute(sqlQuery);
    console.log(queryData);
    return { queryData };
  }
}
