import { Injectable, Inject } from '@nestjs/common';
import { query } from 'express';
import Redis from 'ioredis';
import { SnowflakeService } from '../snowflake/snowflake.service';

@Injectable()
export class RegistrarNameService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async registrarName(json: any): Promise<any> {
    const name: any = await this.redis.get(`zacrRegistrarCode` + json['code']);

    if (name) {
      return {
        status: 'success',
        data: {
          name: name,
        },
        timestamp: new Date().toISOString(),
      };
    }
    const sqlQuery = `SELECT distinct(drr."Name")
      FROM DATA_WAREHOUSE.REGISTRY."Dim Registry Registrar" drr
      where drr."Code" = '${json['code']}';`;

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
    await this.redis.set(
      `zacrRegistrarCode` + json['code'],
      queryData[0]['Name'],
    );

    return {
      status: 'success',
      data: {
        name: queryData[0]['Name'],
      },
      timestamp: new Date().toISOString(),
    };
  }
}
