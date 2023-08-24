import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { json } from 'stream/consumers';
import { DataInterface } from '../interfaces/interfaces';

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
      const sqlQuery = `call ageAnalysis('${filters}')`;

      const dataR = await this.redis.get(`zacr` + sqlQuery);
      let data: DataInterface;
      let formattedData = '';
      if (!dataR) {
        let queryData: any;

        try {
          queryData = await this.snowflakeService.execute(sqlQuery);
        } catch (e) {
          return {
            status: 500,
            error: true,
            message: `${e.message}`,
            timestamp: new Date().toISOString(),
          };
        }

        formattedData = await this.graphFormattingService.formatAgeAnalysis(
          JSON.stringify(queryData),
        );

        data = {
          chartData: JSON.parse(formattedData),
          jsonData: JSON.parse(queryData[0]['AGEANALYSIS']),
        };

        //data = JSON.stringify([formattedData, queryData[0]['AGEANLYSIS']]);
        await this.redis.set(
          `zacr` + sqlQuery,
          JSON.stringify(data),
          'EX',
          72 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }

      return {
        status: 'success',
        data: {
          graphName: graphName,
          data: data,
          warehouse: 'zacr',
          graphType: 'age',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      return {
        status: 500,
        error: true,
        message: `${e.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  ageGraphName(filters: any): string {
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
    return 'Age Analysis of domains for' + rank + filter;
  }
}
