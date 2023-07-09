/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { json } from 'stream/consumers';

@Injectable()
export class AgeService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async age(filters: string, graphName: string): Promise<any>{
    const rank = filters['rank'];
    const overall = filters['overall'];
    const average = filters['average'];
    let filter = '';
    if(overall===true && average === true){
      filter = ', showing the overall average age'
    }else if(overall===false && average ===true){
      filter = ', showing the average age';
    }else if(overall===true && average===false){
      filter = ', showing the overall age';
    }
    filters = JSON.stringify(filters);
    console.log(filters);
    const sqlQuery = `call ageAnalysis('${filters}')`;
    const queryData = await this.snowflakeService.execute(sqlQuery);
    const formattedData = await this.graphFormattingService.formatAgeAnalysis(
      JSON.stringify(queryData),
    );
    return {status: 'success', data: {graphName: 'Average age of domains for the ' + rank + filter , ...JSON.parse(formattedData)} , timestamp: new Date().toISOString()};
  }
}
