import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SnowflakeService } from '../snowflake/snowflake.service';

@Injectable()
export class QBeeService {
  constructor(private readonly snowflakeService: SnowflakeService) {}

  async executeQuery(sqlQuery: string): Promise<any> {
    try {
      const data = await this.snowflakeService.execute(sqlQuery)
      return {
        status: 'success',
        message: data,
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        error: true,
        message: 'Data Warehouse Error while trying to execute QBee statement',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
