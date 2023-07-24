import { Injectable } from '@nestjs/common';
import { SnowflakeService } from '../snowflake/snowflake.service';

@Injectable()
export class RegistrarNameService {
  constructor(private readonly snowflakeService: SnowflakeService) {}

  async registrarName(json: string): Promise<any> {
    try {
      const sqlQuery = `SELECT distinct(drr."Trading Name")
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

      return {
        status: 'success',
        data: {
          name: queryData,
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
}
