/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
@Injectable()
/*
    This filter will handle all connections to the Snowflake warehouse.
    It will currently just execute the query given, which may be a call 
    of a procedure or an SQL statement.
    It could later be used to verify queries.
*/
export class SnowflakeService {
  constructor(
    @Inject('SNOWFLAKE_CONNECTION') private readonly snowflakeConnection,
  ) {}

  /*
  This function calls the query passed through as a parameter on 
  the snowflake warehouse
  */
  execute(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.snowflakeConnection.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          if (err) {
            // console.error(
            //   `Failed to execute statement due to the following error: ${err.message}`,
            // );
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
