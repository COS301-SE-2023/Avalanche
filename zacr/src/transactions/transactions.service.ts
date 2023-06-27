/* eslint-disable prettier/prettier */
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

  
  // async transactions(jsonInput: string): Promise<any> {
  //   jsonInput = JSON.stringify(jsonInput);
  //   console.log(jsonInput);
  //   return new Promise((resolve, reject) => {
  //     this.snowflakeConnection.execute({
  //       sqlText: `call transactionsByRegistrar('${jsonInput}')`,
  //       complete: async (err, stmt, rows) => {
  //         if (err) {
  //           console.error(`Failed to execute statement due to the following error: ${err.message}`);
  //           reject(err);
  //         } else {
  //           console.log('Successfully executed statement.');
  //           const result = JSON.stringify(rows);
  //           await this.redis.set(jsonInput, result);
  //           resolve(rows);
  //         }
  //       },
  //     });
  //   });
  // }

  async transactions(jsonInput: string, graphName: string): Promise<any>{
    jsonInput = JSON.stringify(jsonInput);
    console.log(jsonInput);
    const sqlQuery = `call transactionsByRegistrar('${jsonInput}')`;
    const queryData = await this.snowflakeService.execute(sqlQuery);
    // const analyzedData = await this.statisticalAnalysisService.analyze(
    //   queryData,
    // );
    const formattedData = await this.graphFormattingService.format(
      JSON.stringify(queryData),
    );
    return {status: 'success', data: {graphName: graphName, ...JSON.parse(formattedData)} , timestamp: new Date().toISOString()};
  }
}
