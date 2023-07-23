import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

@Injectable()
export class TransactionService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async transactions(filters: string, graphName: string): Promise<any> {
    graphName = this.transactionsGraphName(filters, false);

    filters = JSON.stringify(filters);
    console.log(filters);
    const sqlQuery = `call transactionsByRegistrar('${filters}')`;

    let formattedData = await this.redis.get(sqlQuery);

    if (!formattedData) {
      const queryData = await this.snowflakeService.execute(sqlQuery);
      // const analyzedData = await this.statisticalAnalysisService.analyze(
      //   queryData,
      // );
      formattedData = await this.graphFormattingService.formatTransactions(
        JSON.stringify(queryData),
      );
      await this.redis.set(sqlQuery, formattedData, 'EX', 24 * 60 * 60);
    }

    return {
      status: 'success',
      data: { graphName: graphName, ...JSON.parse(formattedData) },
      timestamp: new Date().toISOString(),
    };
  }

  async transactionsRanking(filters: string, graphName: string): Promise<any> {
    graphName = this.transactionsGraphName(filters, true);

    filters = JSON.stringify(filters);
    console.log(filters);
    const sqlQuery = `call transactionsByRegistrar('${filters}')`;

    let formattedData = await this.redis.get(sqlQuery);

    if (!formattedData) {
      const queryData = await this.snowflakeService.execute(sqlQuery);
      // const analyzedData = await this.statisticalAnalysisService.analyze(
      //   queryData,
      // );
      formattedData =
        await this.graphFormattingService.formatTransactionsRanking(
          JSON.stringify(queryData),
        );

      await this.redis.set(sqlQuery, formattedData, 'EX', 24 * 60 * 60);
    }
    return {
      status: 'success',
      data: { graphName: graphName, ...JSON.parse(formattedData) },
      timestamp: new Date().toISOString(),
    };
  }

  transactionsGraphName(filters: string, perReg: boolean): string {
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

    let granularity = 'Monthly ';
    const gCheck = filters['granularity'];

    if (gCheck == 'year') {
      granularity = 'Yearly ';
    } else if (gCheck == 'week') {
      granularity = 'Weekly ';
    } else if (gCheck == 'day') {
      granularity = 'Daily ';
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
      zone = ' for all zones in registry';
    }

    let reg = '';
    if (perReg) {
      reg = ' per registrar ';
    }
    return (
      granularity +
      ' Transactions ' +
      reg +
      ' from ' +
      dateFrom +
      ' to ' +
      dateTo +
      zone
    );
  }
}