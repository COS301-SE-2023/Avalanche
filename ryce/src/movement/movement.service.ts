import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class MovementService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async nettVeritical(filters: string, graphName: string): Promise<any> {
    filters = JSON.stringify(filters);
    console.log(filters);
    const sqlQuery = `call nettVerticalMovement('${filters}')`;
    const queryData = await this.snowflakeService.execute(sqlQuery);
    // const analyzedData = await this.statisticalAnalysisService.analyze(
    //   queryData,
    // );
    const formattedData = await this.graphFormattingService.formatNettVertical(
      JSON.stringify(queryData),
    );
    return {
      status: 'success',
      data: { graphName: graphName, ...JSON.parse(formattedData) },
      timestamp: new Date().toISOString(),
    };
  }
}
