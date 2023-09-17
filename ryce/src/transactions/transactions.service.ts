import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { NewDataInterface, formatDate } from '../interfaces/interfaces';

@Injectable()
export class TransactionService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async transactions(filters: any, graphName: string): Promise<any> {
    try {
      filters = JSON.stringify(filters);

      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      const dataR = await this.redis.get(`ryce` + sqlQuery);
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

        formattedData = {
          datasets: [{ label: 'Label1' }, { label: 'Label2' }],
        };

        const graphData = {
          chartData: formattedData,
          jsonData: queryData[0]['TRANSACTIONSBYREGISTRAR'].data,
        };

        filters = queryData[0]['TRANSACTIONSBYREGISTRAR'].filters;

        data = { data: graphData, filters: filters };

        await this.redis.set(
          `ryce` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }

      graphName = this.transactionsGraphName(data.filters, false);

      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'ryce',
          graphType: 'transactions',
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

  async transactionsRanking(filters: any, graphName: string): Promise<any> {
    try {
      const filterObj = JSON.parse(JSON.stringify(filters));
      filters = JSON.stringify(filterObj);

      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      const dataR = await this.redis.get(`ryce` + sqlQuery);
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
        formattedData = {
          datasets: [{ label: 'Label1' }, { label: 'Label2' }],
        };

        const graphData = {
          chartData: formattedData,
          jsonData: queryData[0]['TRANSACTIONSBYREGISTRAR'].data,
        };

        filters = queryData[0]['TRANSACTIONSBYREGISTRAR'].filters;

        const data = { data: { data: graphData, filters: filters } };

        await this.redis.set(
          `ryce` + sqlQuery,
          JSON.stringify(data),
          'EX',
          24 * 60 * 60,
        );
      } else {
        data = JSON.parse(dataR);
      }

      graphName = this.transactionsGraphName(data.filters, true);

      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'ryce',
          graphType: 'transactions-ranking',
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

  transactionsGraphName(filters: any, perReg: boolean): string {
    let dateFrom = filters['dateFrom'];
    dateFrom = formatDate(dateFrom);

    let dateTo = filters['dateTo'];
    dateTo = formatDate(dateTo);

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
    if (zone?.length > 0) {
      zone = ' (' + zone.join(',') + ')';
    } else {
      zone = ' (all zones)';
    }

    let reg = '';
    let trans = 'Transactions ';
    if (perReg) {
      reg = 'per registrar ';
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
