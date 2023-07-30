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
    try {
      graphName = this.transactionsGraphName(filters, false);

      filters = JSON.stringify(filters);
      console.log(filters);
      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      let formattedData = await this.redis.get(`africa` + sqlQuery);

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

        formattedData = await this.graphFormattingService.formatTransactions(
          JSON.stringify(queryData),
        );
        await this.redis.set(
          `africa` + sqlQuery,
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
          warehouse: 'africa',
          graphType: 'transactions',
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

  async transactionsRanking(filters: any, graphName: string): Promise<any> {
    try {
      graphName = this.transactionsGraphName(filters, true);
      const filterObj = JSON.parse(JSON.stringify(filters));
      filterObj.isRanking = true;
      filters = JSON.stringify(filterObj);
      console.log(filters);
      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      let formattedData = await this.redis.get(`africa` + sqlQuery);

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
        formattedData =
          await this.graphFormattingService.formatTransactionsRanking(
            JSON.stringify(queryData),
          );

        await this.redis.set(
          `africa` + sqlQuery,
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
          warehouse: 'africa',
          graphType: 'transactions-ranking',
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

  transactionsGraphName(filters: any, perReg: boolean): string {
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
      zone = ' for ' + zone;
    } else {
      zone = ' for all zones in registry';
    }

    let reg = '';
    if (perReg) {
      reg = 'per registrar ';
    }
    return (
      granularity +
      'Transactions ' +
      reg +
      'from ' +
      dateFrom +
      ' to ' +
      dateTo +
      zone
    );
  }
}
