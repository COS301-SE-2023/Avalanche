import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { json } from 'stream/consumers';
import { DataInterface, NewDataInterface } from '../interfaces/interfaces';
import { RegistrarNameService } from '../registrarName/registrarName.service';

@Injectable()
export class AgeService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
    private readonly registrarNameServices: RegistrarNameService,
  ) {}

  async age(filters: string, graphName: string): Promise<any> {
    try {
      filters = JSON.stringify(filters);
      const sqlQuery = `call ageAnalysis('${filters}')`;

      const dataR = await this.redis.get(`ryce` + sqlQuery);
      let data: NewDataInterface;
      let formattedData;
      if (!dataR) {
        let queryData: any;

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

        const topNRegistrars = queryData[0]['AGEANALYSIS'].data;
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
            if (item.Registrar != name && item.Registrar != 'Overall') {
              item.Registrar = `Registrar ${index + 1}`;
            }
          });
        }

        const topNRegistrarsArr = [
          { AGEANALYSIS: JSON.stringify(topNRegistrars) },
        ];

        formattedData = await this.graphFormattingService.formatAgeAnalysis(
          JSON.stringify(topNRegistrarsArr),
        );

        const graphData = {
          chartData: JSON.parse(formattedData),
          jsonData: topNRegistrars,
        };

        filters = queryData[0]['AGEANALYSIS'].filters;

        data = { data: graphData, filters: filters };

        //data = JSON.stringify([formattedData, queryData[0]['AGEANLYSIS']]);
        await this.redis.set(
          `ryce` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }

      graphName = this.ageGraphName(data.filters);

      return {
        status: 'success',
        data: {
          graphName: graphName,
          data: data.data,
          filters: data.filters,
          warehouse: 'ryce',
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
