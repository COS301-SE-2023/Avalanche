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

  async age(filters: string, graphName: string): Promise<any> {
    try {
      graphName = this.ageGraphName(filters);
      filters = JSON.stringify(filters);
      console.log(filters);
      const sqlQuery = `call ageAnalysis('${filters}')`;

      let formattedData = await this.redis.get(`africa` + sqlQuery);

      if (!formattedData) {
        let queryData: any;

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

        formattedData = await this.graphFormattingService.formatAgeAnalysis(
          JSON.stringify(queryData),
        );

        await this.redis.set(
          `africa` + sqlQuery,
          formattedData,
          'EX',
          24 * 60 * 60,
        );
      }

      return {
        status: 'success',
        data: { graphName: graphName, ...JSON.parse(formattedData) },
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      return {
        status: 500,
        error: true,
        message: e,
        timestamp: new Date().toISOString(),
      };
    }
  }

  ageGraphName(filters: string): string {
    let rank = filters['rank'];
    if (rank) {
      rank = ' the ' + rank + ' registrars in terms of domain count ';
    } else {
      rank = ' all registrars ';
    }
    const overall = filters['overall'];
    const average = filters['average'];
    let filter = '';
    if (overall === true && average === true) {
      filter = ', showing the overall average age';
    } else if (overall === false && average === true) {
      filter = ', showing the average age per registrar';
    } else if (overall === true && average === false) {
      filter = ', showing the overall number of domains per age';
    } else if (overall === false && average === false) {
      filter = ', showing the number of domains per age per registrar';
    }
    return 'Age Analysis of domains for ' + rank + filter;
  }
}
