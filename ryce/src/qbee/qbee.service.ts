import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class QBeeService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async retrieveSchemas(filters: string, graphName: string): Promise<any> {
    //
  }
}
