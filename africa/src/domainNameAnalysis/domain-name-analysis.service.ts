import { HttpService } from '@nestjs/axios';
import Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { DataInterface } from 'src/interfaces/interfaces';

@Injectable()
export class DomainNameAnalysisService {
  constructor(
    private httpService: HttpService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) { }

  async sendData(dataO: any): Promise<any> {
    try {
      const filters = JSON.stringify(dataO.filters);

      const num = dataO.filters.num;
      const granularity = dataO.filters.granularity;

      const sqlQuery = `call domainNameAnalysis('${filters}')`;

      const dataR = await this.redis.get(`africa` + sqlQuery);
      let data: DataInterface;
      let formattedData = '';
      //console.log(dataR);
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
        //console.log(queryData[0]['DOMAINNAMEANALYSIS']);
        dataO.data = queryData[0]['DOMAINNAMEANALYSIS'];
        delete dataO.filters;
        const response = this.httpService.post(
          'http://zanet.cloud:4101/domainNameAnalysis/count',
          dataO,
        );
        const responseData = await lastValueFrom(response);
        //console.log(responseData);
        formattedData =
          await this.graphFormattingService.formatDomainNameAnalysis(
            JSON.stringify(responseData.data),
          );
        data = {
          chartData: JSON.parse(formattedData),
          jsonData: responseData.data.data,
        };
        await this.redis.set(
          `africa` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }
      //console.log(data);
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
          warehouse: 'africa',
          graphType: 'domainNameAnalysis/count',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      //console.log(e);
      return {
        status: 500,
        error: true,
        message: `${e.message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async classification(dataO: any): Promise<any> {
    try {
      const filters = JSON.stringify(dataO.filters);

      const num = dataO.filters.num;
      const granularity = dataO.filters.granularity;

      const sqlQuery = `call domainNameAnalysis('${filters}')`;

      const dataR = await this.redis.get(`africa` + sqlQuery + ` classification`);
      let data: DataInterface;
      let formattedData = '';
      //console.log(dataR);
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
        //console.log(queryData[0]['DOMAINNAMEANALYSIS']);
        dataO.data = queryData[0]['DOMAINNAMEANALYSIS'];
        delete dataO.filters;
        const response = this.httpService.post(
          'http://localhost:4101/domainNameAnalysis/classify',
          dataO,
        );
        const responseData = await lastValueFrom(response);
        console.log(responseData);
        let formattedResponseData = {data: this.formatClassification(responseData.data.data)}
        formattedData =
          await this.graphFormattingService.formatDomainNameAnalysisClassification(
            JSON.stringify(formattedResponseData),
          );
        data = {
          chartData: JSON.parse(formattedData),
          jsonData: formattedResponseData,
        };
        console.log(data);
        await this.redis.set(
          `africa` + sqlQuery + ` classification`,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }
      //console.log(data);
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
          warehouse: 'africa',
          graphType: 'domainNameAnalysis/classification',
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

  async domainLength(filters: string, graphName: string): Promise<any> {
    try {
      graphName = this.domainLengthGraphName(filters);

      filters = JSON.stringify(filters);

      const sqlQuery = `CALL SKUNKWORKS_DB.public.domainLengthAnalysis('${filters}')`;

      const dataR = await this.redis.get(`africa` + sqlQuery);
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
        // const analyzedData = await this.statisticalAnalysisService.analyze(
        //   queryData,
        // );
        formattedData =
          await this.graphFormattingService.formatDomainLengthAnalysis(
            JSON.stringify(queryData),
          );
        data = {
          chartData: JSON.parse(formattedData),
          jsonData: JSON.parse(queryData[0]['DOMAINLENGTHANALYSIS']),
        };
        await this.redis.set(
          `africa` + sqlQuery,
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
          warehouse: 'africa',
          graphType: 'domainNameAnalysis/length',
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
    if (zone) {
      if (zone.length > 0) {
        const zoneArr = [];
        for (const r of zone) {
          zoneArr.push(r);
        }
        zone = zoneArr.join(', ');
      }
      zone = ' for ' + zone;
    } else {
      zone = ' for all zones';
    }

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

    return (
      'Length of newly created domains from ' +
      dateFrom +
      ' to ' +
      dateTo +
      registrar +
      zone
    );
  }

  getMonth(num: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[num];
  }

  formatClassification(inputData: any) {
    console.log(inputData)
    console.log(JSON.stringify(inputData))
    const outputData = {};

    // Step 2: Loop through the input array
    for (const entry of inputData) {
      const { domain, classification } = entry;

      // Step 3: Update the count and domains for each classification
      if (!outputData[classification]) {
        outputData[classification] = {
          category: classification,
          count: 0,
          domains: [],
        };
      }

      outputData[classification].count += 1;
      outputData[classification].domains.push(domain);
    }

    // Step 4: Convert the object to an array
    const finalOutput = Object.values(outputData);

    return finalOutput
  }
  /*
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
  */
}
