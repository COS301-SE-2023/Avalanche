/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as snowflake from 'snowflake-sdk';
import config from './snowflake.config';

@Injectable()
export class SnowflakeService {
  private connection: snowflake.Connection;

  constructor() {
    this.connection = snowflake.createConnection(config);
    this.connect();
  }

  private connect(): void {
    this.connection.connect((err, conn) => {
      if (err) {
        console.error('Unable to connect to Snowflake:', err);
      } else {
        console.log('Successfully connected to Snowflake.');
        this.connection = conn;
        this.setWarehouse(config.warehouse);
        this.setDatabase(config.database);
        this.setSchema(config.schema);
      }
    });
  }

  private setWarehouse(warehouse: string): void {
    this.connection.execute({
      sqlText: `USE WAREHOUSE ${warehouse};`,
      complete: (err) => {
        if (err) {
          console.error(`Unable to set warehouse: ${warehouse}`, err);
        } else {
          console.log(`Warehouse set to: ${warehouse}`);
        }
      },
    });
  }

  private setDatabase(database: string): void {
    this.connection.execute({
      sqlText: `USE DATABASE ${database};`,
      complete: (err) => {
        if (err) {
          console.error(`Unable to set database: ${database}`, err);
        } else {
          console.log(`Database set to: ${database}`);
        }
      },
    });
  }

  private setSchema(schema: string): void {
    this.connection.execute({
      sqlText: `USE SCHEMA ${schema};`,
      complete: (err) => {
        if (err) {
          console.error(`Unable to set schema: ${schema}`, err);
        } else {
          console.log(`Schema set to: ${schema}`);
        }
      },
    });
  }

  public async select(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  }

  public async fetchData(type: string,tableName: string, limit: number): Promise<any[]> {
    if(type.match("select")){
      const query = `SELECT * FROM ${tableName} LIMIT ${limit} ;`;
      return this.select(query);
    }else{
      const query = `SELECT TOP 10 * FROM ${tableName}  ;`;
      return this.select(query);
    }
  }
}