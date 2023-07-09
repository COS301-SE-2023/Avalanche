import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class MarketShareService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async marketShare(filters: string, graphName: string): Promise<any> {
    const rank = filters['rank'] as string;
    filters = JSON.stringify(filters);
    console.log(filters);
    const sqlQuery = `call marketShare('${filters}')`;
    const queryData = await this.snowflakeService.execute(sqlQuery);
    // const analyzedData = await this.statisticalAnalysisService.analyze(
    //   queryData,
    // );

    const formattedData = await this.graphFormattingService.formatMarketshare(
      JSON.stringify(queryData),
    );
    return {
      status: 'success',
      data: {
        graphName: 'Market share showing ' + rank,
        ...JSON.parse(formattedData),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
