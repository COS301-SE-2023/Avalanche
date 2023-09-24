import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import {
  ChartType,
  formatDate,
  NewDataInterface,
} from '../interfaces/interfaces';

@Injectable()
export class MovementService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
    private readonly statisticalAnalysisService: AnalysisService,
    private readonly graphFormattingService: GraphFormatService,
  ) {}

  async nettVeritical(filters: string, graphName: string): Promise<any> {
    try {
      filters = JSON.stringify(filters);

      const sqlQuery = `call nettVerticalMovement('${filters}')`;

      const dataR = await this.redis.get(`ryce` + sqlQuery);
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

        if (
          queryData[0]['NETTVERTICALMOVEMENT'].filters?.registrar?.length > 0
        ) {
          formattedData = {
            datasets: [{ label: 'Vertical Movement' }],
          };
        } else {
          formattedData = {
            datasets: [{ label: 'Vertical Movement' }],
          };
        }

        const graphData = {
          chartData: formattedData,
          jsonData: queryData[0]['NETTVERTICALMOVEMENT'].data,
        };

        filters = queryData[0]['NETTVERTICALMOVEMENT'].filters;

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

      graphName = this.netVerticalGraphName(data.filters);

      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'ryce',
          graphType: 'movement/vertical',
          data: data.data,
          filters: data.filters,
          chartType:
            data.filters.registrar?.length > 0 ? ChartType.Line : ChartType.Bar,
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

  async nettVeriticalRanked(filters: string, graphName: string): Promise<any> {
    try {
      filters = JSON.stringify(filters);
      const sqlQuery = `call netVerticalMovementRanked('${filters}')`;

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
          datasets: [{ label: 'Vertical Ranked' }],
        };

        const graphData = {
          chartData: formattedData,
          jsonData: queryData[0]['NETVERTICALMOVEMENTRANKED'].data,
        };

        filters = queryData[0]['NETVERTICALMOVEMENTRANKED'].filters;

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

      graphName = this.verticalRankedGraphName(data.filters);

      filters = JSON.parse(filters);
      return {
        status: 'success',
        data: {
          graphName: graphName,
          warehouse: 'ryce',
          graphType: 'movement/verticalRanked',
          data: data.data,
          filters: data.filters,
          chartType: ChartType.Bar,
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

  netVerticalGraphName(filters: any): string {
    let registrar = filters['registrar'];
    if (registrar) {
      if (registrar.length > 0) {
        const regArr = [];
        for (const r of registrar) {
          regArr.push(r);
        }
        registrar = ` for ${regArr.join(', ')}`;
      }
    } else {
      registrar = ' for all registrars';
    }

    let zone = filters['zone'];
    if (zone?.length > 0) {
      zone = ' (' + zone.join(',') + ')';
    } else {
      zone = ' (all zones)';
    }

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

    return (
      granularity +
      'Net Vertical Movement (Creates-Deletes) from ' +
      dateFrom +
      ' to ' +
      dateTo +
      registrar +
      zone
    );
  }

  verticalRankedGraphName(filters) {
    let title = 'Net Vertical Movement ';

    // Rank
    if (filters.rank) {
      title += `for the ${filters.rank}`;
    } else {
      title += 'for all Registrars';
    }

    // Registrar
    if (
      filters.registrar !== 'all' &&
      Array.isArray(filters.registrar) &&
      filters.registrar.length > 0
    ) {
      const regList = filters.registrar.join(', ');
      title += ` (Specifically: ${regList})`;
    }

    // Date
    if (filters.dateFrom && filters.dateTo) {
      title += `, from ${formatDate(filters.dateFrom)} to ${formatDate(
        filters.dateTo,
      )}`;
    }

    // Zone
    let zone = filters['zone'];
    if (zone?.length > 0) {
      zone = ' (' + zone.join(',') + ')';
    } else {
      zone = ' (all zones)';
    }

    title += zone;

    return title;
  }
}
