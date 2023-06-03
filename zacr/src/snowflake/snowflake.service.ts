import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class SnowflakeService {
  constructor(
    @Inject('SNOWFLAKE_CONNECTION') private readonly snowflakeConnection,
  ) {}

  execute(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.snowflakeConnection.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error(
              `Failed to execute statement due to the following error: ${err.message}`,
            );
            reject(err);
          } else {
            console.log('Successfully executed statement.');
            resolve(rows);
          }
        },
      });
    });
  }
}
