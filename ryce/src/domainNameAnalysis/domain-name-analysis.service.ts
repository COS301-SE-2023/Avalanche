import { HttpService } from '@nestjs/axios';
import Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class DomainNameAnalysisService {
  constructor(
    private httpService: HttpService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async sendData(data: any): Promise<any> {
    try {
      console.log(data);
      const filters = JSON.stringify(data.filters);
      console.log(filters);
      const num = data.filters.num;
      const granularity = data.filters.granularity;

      const sqlQuery = `call domainNameAnalysis('${filters}')`;
      console.log(sqlQuery);
      let formattedData = await this.redis.get(`ryce` + sqlQuery);

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
        console.log(queryData[0]['DOMAINNAMEANALYSIS']);
        data.data = queryData[0]['DOMAINNAMEANALYSIS'];
        delete data.filters;
        const response = this.httpService.post(
          'http://zanet.cloud:4005/domainNameAnalysis/list',
          data,
        );
        const responseData = await lastValueFrom(response);
        console.log(responseData);
        formattedData =
          await this.graphFormattingService.formatDomainNameAnalysis(
            JSON.stringify(responseData.data),
          );
        await this.redis.set(
          `ryce` + sqlQuery,
          formattedData,
          'EX',
          24 * 60 * 60,
        );
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
          warehouse: 'ryce',
          graphType: 'domainNameAnalysis/count',
          ...JSON.parse(formattedData),
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
      graphName = this.domainLengthGraphName(filters);

      filters = JSON.stringify(filters);
      console.log(filters);
      const sqlQuery = `CALL SKUNKWORKS_DB.public.domainLengthAnalysis('${filters}')`;

      let formattedData = await this.redis.get(`ryce` + sqlQuery);

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
        // const analyzedData = await this.statisticalAnalysisService.analyze(
        //   queryData,
        // );
        formattedData =
          await this.graphFormattingService.formatDomainLengthAnalysis(
            JSON.stringify(queryData),
          );
        await this.redis.set(
          `ryce` + sqlQuery,
          formattedData,
          'EX',
          24 * 60 * 60,
        );
      }
      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'ryce',
          graphType: 'domainNameAnalysis/length',
          ...JSON.parse(formattedData),
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

  domainLengthGraphName(filters: string): string {
    let registrar = filters['registrar'];
    if (registrar) {
      if (registrar.length > 0) {
        const regArr = [];
        for (const r of registrar) {
          regArr.push(r);
        }
        registrar += regArr.join(', ');
        registrar = ' for ' + registrar;
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
      zone = ' for all zones ';
    }

    let dateFrom;
    if (filters['dateFrom'] === undefined) {
      dateFrom = new Date();
      dateFrom.setFullYear(dateFrom.getUTCFullYear() - 1);
      dateFrom = dateFrom.getFullYear() + '-01-01';
    } else {
      dateFrom = new Date(filters['dateFrom']);
      let month = dateFrom.getUTCMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = dateFrom.getUTCDate();
      day = day < 10 ? '0' + day : day;
      dateFrom = dateFrom.getUTCFullYear() + '-' + month + '-' + day;
    }

    let dateTo;
    if (filters['dateTo'] === undefined) {
      dateTo = new Date();
      dateTo.setFullYear(dateTo.getUTCFullYear() - 1);
      dateTo = dateTo.getFullYear() + '-12-31';
    } else {
      dateTo = new Date(filters['dateTo']);
      let month = dateTo.getUTCMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = dateTo.getUTCDate();
      day = day < 10 ? '0' + day : day;
      dateTo = dateTo.getUTCFullYear() + '-' + month + '-' + day;
    }

    return (
      'Length of newly created domains from ' +
      dateFrom +
      ' to ' +
      dateTo +
      registrar +
      zone
    );
  }

  normaliseData(data: string): string {
    const dataArr = JSON.parse(data)['data'];
    const minFrequency = Math.min(...dataArr.map((item) => item.frequency));
    const maxFrequency = Math.max(...dataArr.map((item) => item.frequency));

    const newMin = 10;
    const newMax = 60;

    // Normalize each frequency, scaling it to be within [newMin, newMax]
    const normalizedData = dataArr.map((item) => ({
      ...item,
      normalisedFrequency: this.normalize(
        item.frequency,
        minFrequency,
        maxFrequency,
        newMin,
        newMax,
      ),
    }));

    return JSON.stringify(normalizedData);
  }

  normalize(
    value: number,
    min: number,
    max: number,
    newMin: number,
    newMax: number,
  ): number {
    return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
  }
}
