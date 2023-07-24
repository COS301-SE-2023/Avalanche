import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class MarketShareService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async marketShare(filters: string, graphName: string): Promise<any> {
    try {
      graphName = this.marketShareGraphName(filters);

      filters = JSON.stringify(filters);
      console.log(filters);
      const sqlQuery = `call marketShare('${filters}')`;

      let formattedData = await this.redis.get(`zacr` + sqlQuery);

      if (!formattedData) {
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
        formattedData = await this.graphFormattingService.formatMarketshare(
          JSON.stringify(queryData),
        );

        await this.redis.set(
          `zacr` + sqlQuery,
          formattedData,
          'EX',
          24 * 60 * 60,
        );
      }
      return {
        status: 'success',
        data: {
          graphName: graphName,
          ...JSON.parse(formattedData),
        },
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

  marketShareGraphName(filters: string): string {
    let rank = filters['rank'];
    if (rank) {
      rank = ' for the ' + rank + ' registrars in terms of domain count ';
    }

    let registrar = filters['registrar'];
    if (registrar) {
      if (registrar.length > 0) {
        const regArr = [];
        for (const r of registrar) {
          regArr.push(r);
        }
        registrar += regArr.join(', ');
        registrar = ' across ' + registrar;
      }
    } else {
      registrar = ' across all registrars ';
    }

    let zone = filters['zone'];
    if (zone) {
      if (zone.length > 0) {
        const zoneArr = [];
        for (const r of zone) {
          zoneArr.push(r);
        }
        zone += zoneArr.join(', ');
      }
      zone = ' for ' + zone;
    } else {
      zone = ' all zones ';
    }

    return 'Domain count marketshare ' + rank + registrar + zone;
  }
}
