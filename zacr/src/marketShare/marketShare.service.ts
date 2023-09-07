import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { DataInterface } from '../interfaces/interfaces';
import { query } from 'express';

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
      const sqlQuery = `call marketShare('${filters}')`;

      const dataR = await this.redis.get(`zacr` + sqlQuery);
      let data: DataInterface;
      let formattedData = '';
      if (!dataR) {
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
        /**
         * Get the total
         */
        let filtersCount = {};
        if (JSON.parse(filters).zone != undefined) {
          filtersCount = { zone: JSON.parse(filters).zone };
        }
        filtersCount = JSON.stringify(filtersCount);
        const sqlCountQuery = `call domainCount('${filtersCount}')`;

        let dataCount: any = await this.redis.get(`zacr` + sqlCountQuery);
        if (!dataCount) {
          try {
            dataCount = await this.snowflakeService.execute(sqlCountQuery);

            await this.redis.set(
              `zacr` + sqlCountQuery,
              JSON.stringify(dataCount),
              'EX',
              24 * 60 * 60,
            );
          } catch (e) {
            return {
              status: 500,
              error: true,
              message: 'Data Warehouse Error',
              timestamp: new Date().toISOString(),
            };
          }
        } else {
          dataCount = JSON.parse(dataCount);
        }
        const overallCount = JSON.parse(dataCount[0]['DOMAINCOUNT'])[0][
          'NumInRegistry'
        ];

        const topNRegistrars = JSON.parse(queryData[0]['MARKETSHARE']);

        const totalTopNRegistrarsCount = topNRegistrars.reduce(
          (acc, curr) => acc + curr.NumInRegistry,
          0,
        );

        const otherRegistrarCount = overallCount - totalTopNRegistrarsCount;
        topNRegistrars.push({
          Registrar: 'Other',
          NumInRegistry: otherRegistrarCount,
        });


        const topNRegistrarsArr = [
          { MARKETSHARE: JSON.stringify(topNRegistrars) },
        ];

        formattedData = await this.graphFormattingService.formatMarketshare(
          JSON.stringify(topNRegistrarsArr),
        );


        data = {
          chartData: JSON.parse(formattedData),
          jsonData: topNRegistrars,
        };


        await this.redis.set(
          `zacr` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
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
          graphType: 'marketShare',
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

  marketShareGraphName(filters: any): string {
    let rank = filters['rank'];
    if (rank) {
      rank = 'for the ' + rank + ' registrars in terms of domain count ';
    } else {
      rank = '';
    }

    let registrar = filters['registrar'];
    if (registrar) {
      if (registrar.length > 0) {
        const regArr = [];
        for (const r of registrar) {
          regArr.push(r);
        }
        registrar = regArr.join(', ');
        registrar = 'across ' + registrar + ' ';
      }
    } else {
      registrar = 'across all registrars ';
    }

    let zone = filters['zone'];
    if (zone) {
      if (zone.length > 0) {
        const zoneArr = [];
        for (const r of zone) {
          zoneArr.push(r);
        }
        zone = zoneArr.join(', ');
      }
      zone = 'for ' + zone;
    } else {
      zone = 'for all zones ';
    }

    return 'Domain count marketshare ' + rank + registrar + zone;
  }
}
