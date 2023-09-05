import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { DataInterface } from '../interfaces/interfaces';

@Injectable()
export class TransactionService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async transactions(filters: any, graphName: string): Promise<any> {
    try {
      graphName = this.transactionsGraphName(filters, false);

      filters = JSON.stringify(filters);

      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      const dataR = await this.redis.get(`ryce` + sqlQuery);
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

        formattedData = await this.graphFormattingService.formatTransactions(
          JSON.stringify(queryData),
        );

        data = {
          chartData: JSON.parse(formattedData),
          jsonData: JSON.parse(queryData[0]['TRANSACTIONSBYREGISTRAR']),
        };

        await this.redis.set(
          `ryce` + sqlQuery,
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
          warehouse: 'ryce',
          graphType: 'transactions',
          data: data,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      console.log(e.message);
      return {
        status: 500,
        error: true,
        message: `${e.message}`,
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

      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      const dataR = await this.redis.get(`ryce` + sqlQuery);
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
        //console.log(queryData);
        formattedData =
          await this.graphFormattingService.formatTransactionsRanking(
            JSON.stringify(queryData),
          );

        data = {
          chartData: JSON.parse(formattedData),
          jsonData: JSON.parse(queryData[0]['TRANSACTIONSBYREGISTRAR']),
        };

        await this.redis.set(
          `ryce` + sqlQuery,
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
          warehouse: 'ryce',
          graphType: 'transactions-ranking',
          data: data,
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
    let trans = 'Transactions ';
    if (perReg) {
      reg = 'per registrar ';
      console.log(filters['transactions']);
      if (filters['transactions']?.length > 0) {
        trans = '';
        for (let i = 0; i < filters['transactions']?.length - 1; i++) {
          trans += filters['transactions'][i] + ', ';
        }
        trans +=
          filters['transactions'][filters['transactions']?.length - 1] + ' ';
      }
    }

    return (
      granularity + trans + reg + 'from ' + dateFrom + ' to ' + dateTo + zone
    );
  }
}
