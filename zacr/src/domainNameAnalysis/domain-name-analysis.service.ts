import { HttpService } from '@nestjs/axios';
import Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { DataInterface, NewDataInterface } from 'src/interfaces/interfaces';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DomainNameAnalysisService {
  constructor(
    private httpService: HttpService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async sendData(dataO: any): Promise<any> {
    try {
      const filters = JSON.stringify(dataO.filters);
      const num = dataO.filters.num;
      const granularity = dataO.filters.granularity;

      const sqlQuery = `call domainNameAnalysis('${filters}')`;
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

        dataO.data = queryData[0]['DOMAINNAMEANALYSIS'];
        delete dataO.filters;
        const response = this.httpService.post(
          'http://DomainAnalysis:4101/domainNameAnalysis/count',
          dataO,
        );
        const responseData = await lastValueFrom(response);
        formattedData =
          await this.graphFormattingService.formatDomainNameAnalysis(
            JSON.stringify(responseData.data),
          );

        data = {
          chartData: JSON.parse(formattedData),
          jsonData: responseData.data.data,
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
          graphName:
            'Most common sub words in newly created domains in the last ' +
            num +
            ' ' +
            granularity +
            '(s)',
          data: data,
          warehouse: 'zacr',
          graphType: 'domainNameAnalysis/count',
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

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async classification(dataO: any): Promise<any> {
    try {
      const filters = JSON.stringify(dataO.filters);

      const num = dataO.filters.num;
      const granularity = dataO.filters.granularity;

      const sqlQuery = `call domainNameAnalysis('${filters}')`;

      const dataR = await this.redis.get(`zacr` + sqlQuery + ` classification`);
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
        dataO.data = queryData[0]['DOMAINNAMEANALYSIS'];
        delete dataO.filters;
        const response = this.httpService.post(
          'http://DomainAnalysis:4101/domainNameAnalysis/classify',
          dataO,
        );
        const responseData = await lastValueFrom(response);
        const formattedResponseData = {
          data: this.formatClassification(responseData.data.data),
        };
        formattedData =
          await this.graphFormattingService.formatDomainNameAnalysisClassification(
            JSON.stringify(formattedResponseData),
          );
        data = {
          chartData: JSON.parse(formattedData),
          jsonData: formattedResponseData.data,
        };
        await this.redis.set(
          `zacr` + sqlQuery + ` classification`,
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
          graphName:
            'Most common categories in newly created domains in the last ' +
            num +
            ' ' +
            granularity +
            '(s)',
          data: data,
          warehouse: 'zacr',
          graphType: 'domainNameAnalysis/classification',
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

  async domainLength(filters: string, graphName: string): Promise<any> {
    try {
      filters = JSON.stringify(filters);

      const sqlQuery = `CALL SKUNKWORKS_DB.public.domainLengthAnalysis('${filters}')`;

      const dataR = await this.redis.get(`zacr` + sqlQuery);
      let data: NewDataInterface;
      let formattedData;

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
        // const analyzedData = await this.statisticalAnalysisService.analyze(
        //   queryData,
        // );
        formattedData = {
          datasets: [{ label: 'Label1' }],
        };

        const graphData = {
          chartData: formattedData,
          jsonData: queryData[0]['DOMAINLENGTHANALYSIS'].data,
        };

        filters = queryData[0]['DOMAINLENGTHANALYSIS'].filters;

        data = { data: graphData, filters: filters };

        await this.redis.set(
          `zacr` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }

      graphName = this.domainLengthGraphName(data.filters);

      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'zacr',
          graphType: 'domainNameAnalysis/length',
          data: data.data,
          filters: data.filters,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        error: true,
        message: `${e.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  domainLengthGraphName(filters: any): string {
    let registrar = filters['registrar'];
    if (registrar) {
      if (registrar.length > 0) {
        const regArr = [];
        for (const r of registrar) {
          regArr.push(r);
        }
        registrar = regArr.join(', ');
        registrar = ' for ' + registrar;
      }
    } else {
      registrar = ' across all registrars';
    }

    let zone = filters['zone'];
    if (zone?.length > 0) {
      zone = ' (' + zone.join(',') + ')';
    } else {
      zone = ' (all zones)';
    }

    /*
    let dateFrom;
    if (filters['dateFrom'] === undefined) {
      dateFrom = new Date();
      dateFrom.setFullYear(dateFrom.getUTCFullYear() - 1);
      dateFrom = '01 January ' + dateFrom.getUTCFullYear();
    } else {
      dateFrom = new Date(filters['dateFrom']);
      const monthNum = dateFrom.getUTCMonth() + 1;
      const month = monthNum < 10 ? '0' + monthNum : monthNum;
      let day = dateFrom.getUTCDate();
      day = day < 10 ? '0' + day : day;
      const year = dateFrom.getUTCFullYear();
      dateFrom =
        day +
        ' ' +
        this.getMonth(monthNum - 1) +
        ' ' +
        dateFrom.getUTCFullYear();
    }

    let dateTo;
    if (filters['dateTo'] === undefined) {
      dateTo = new Date();
      dateTo.setFullYear(dateTo.getUTCFullYear() - 1);
      dateTo = '31 December ' + dateTo.getUTCFullYear();
    } else {
      dateTo = new Date(filters['dateTo']);
      const monthNum = dateTo.getUTCMonth() + 1;
      const month = monthNum < 10 ? '0' + monthNum : monthNum;
      let day = dateTo.getUTCDate();
      day = day < 10 ? '0' + day : day;
      dateTo =
        day + ' ' + this.getMonth(monthNum - 1) + ' ' + dateTo.getUTCFullYear();
    }
    */

    return 'Length of newly created domains ' + registrar + zone;
  }

  formatClassification(inputData: any) {
    const outputData = {};

    // Step 2: Loop through the input array
    for (const entry of inputData) {
      const { domain, classification } = entry;

      // Step 3: Update the count and domains for each classification
      if (!outputData[classification]) {
        outputData[classification] = {
          category: classification,
          count: 0,
        };
      }

      outputData[classification].count += 1;
    }

    // Step 4: Convert the object to an array
    const finalOutput = Object.values(outputData);

    return finalOutput;
  }
}
