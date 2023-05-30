/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class TransactionService {
  constructor(private jwtService: JwtService, 
    @Inject('SNOWFLAKE_CONNECTION') private readonly snowflakeConnection) { }

  async transactions(jsonInput: string): Promise<any> {
    jsonInput = JSON.stringify(jsonInput);
    console.log(jsonInput);
    return new Promise((resolve, reject) => {
      this.snowflakeConnection.execute({
        sqlText: `call transactionsByRegistrar('${jsonInput}')`,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error(`Failed to execute statement due to the following error: ${err.message}`);
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