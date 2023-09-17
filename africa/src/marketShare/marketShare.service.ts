import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { RegistrarNameService } from '../registrarName/registrarName.service';
import { NewDataInterface } from '../interfaces/interfaces';

@Injectable()
export class MarketShareService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly registrarNameServices: RegistrarNameService,
  ) {}

  async marketShare(filters: string, graphName: string): Promise<any> {
    try {
      filters = JSON.stringify(filters);
      const sqlQuery = `call marketShare('${filters}')`;

      const dataR = await this.redis.get(`africa` + sqlQuery);
      let data: NewDataInterface;
      let formattedData;

      if (!dataR) {
        let queryData;
        try {
          queryData = await this.snowflakeService.execute(sqlQuery);
        } catch (e) {
          console.debug(e);
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
          filtersCount = {
            zone: JSON.parse(filters).zone,
            registrar: JSON.parse(filters).registrar,
          };
        }
        filtersCount = JSON.stringify(filtersCount);
        const sqlCountQuery = `call domainCount('${filtersCount}')`;

        let dataCount: any = await this.redis.get(`africa` + sqlCountQuery);
        if (!dataCount) {
          try {
            dataCount = await this.snowflakeService.execute(sqlCountQuery);

            await this.redis.set(
              `africa` + sqlCountQuery,
              JSON.stringify(dataCount),
              'EX',
              24 * 60 * 60,
            );
          } catch (e) {
            console.debug(e);
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
        const overallCount =
          dataCount[0]['DOMAINCOUNT'].data[0]['NumInRegistry'];

        const topNRegistrars = queryData[0]['MARKETSHARE'].data;

        const totalTopNRegistrarsCount = topNRegistrars.reduce(
          (acc, curr) => acc + (curr.NumInRegistry ? curr.NumInRegistry : 0),
          0,
        );

        // Replace registrar names to anonymise

        if (JSON.parse(filters).tou != 'registry') {
          let name: any = 'NoNameSpecified';
          if (
            JSON.parse(filters).registrar &&
            JSON.parse(filters).registrar.length == 1
          ) {
            name = await this.registrarNameServices.registrarName({
              code: JSON.parse(filters).registrar[0],
            });
            name = name.data.name;
          }

          topNRegistrars.forEach((item, index) => {
            if (index != 0 && item.Registrar != name) {
              item.Registrar = `Registrar ${index}`;
            }
          });
        }

        const otherRegistrarCount = overallCount - totalTopNRegistrarsCount;
        topNRegistrars.push({
          Registrar: 'Other',
          NumInRegistry: otherRegistrarCount,
        });

        formattedData = {
          datasets: [{ label: 'Marketshare' }],
        };

        const graphData = {
          chartData: formattedData,
          jsonData: topNRegistrars,
        };

        filters = queryData[0]['MARKETSHARE'].filters;

        data = { data: graphData, filters: filters };

        await this.redis.set(
          `africa` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }

      graphName = this.marketShareGraphName(data.filters);

      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'africa',
          graphType: 'marketShare',
          data: data.data,
          filters: data.filters,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      console.debug(e);
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
      rank = 'The ' + rank + ' registrars (i.t.o. domain count)';
    } else {
      rank = 'The top5';
    }

    // Registrar
    let registrar = '';
    if (
      filters.registrar !== 'all' &&
      Array.isArray(filters.registrar) &&
      filters.registrar.length > 0
    ) {
      const regList = filters.registrar.join(', ');
      registrar += ` (Specifically also including: ${regList})`;
    }

    let zone = filters['zone'];
    if (zone?.length > 0) {
      zone = ' (' + zone.join(',') + ')';
    } else {
      zone = ' (all zones)';
    }

    return rank + registrar + zone;
  }
}
