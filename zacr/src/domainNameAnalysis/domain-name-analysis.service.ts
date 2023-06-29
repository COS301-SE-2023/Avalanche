import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { GraphFormatService } from 'src/graph-format/graph-format.service';

@Injectable()
export class DomainNameAnalysisService {
  constructor(
    private httpService: HttpService,
    private readonly snowflakeService: SnowflakeService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async sendData(data: any): Promise<any> {
    console.log(data);
    const jsonInput = JSON.stringify(data.jsonInput);
    console.log(jsonInput);
    const sqlQuery = `call domainNameAnalysis('${jsonInput}')`;
    console.log(sqlQuery);
    const queryData = await this.snowflakeService.execute(sqlQuery);
    console.log(queryData[0]['DOMAINNAMEANALYSIS']);
    data.data = queryData[0]['DOMAINNAMEANALYSIS'];
    delete data.jsonInput;
    const response = this.httpService.post(
      'http://zanet.cloud:4005/domainNameAnalysis/list',
      data,
    );
    const responseData = await lastValueFrom(response);
    const formattedData =
      await this.graphFormattingService.formatDomainNameAnalysis(
        JSON.stringify(responseData.data),
      );
    return {
      status: 'success',
      data: {
        graphName: 'Domain Name Analysis',
        ...JSON.parse(formattedData),
      },
      timestamp: new Date().toISOString(),
    };
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
