/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import snowflake = require('snowflake-sdk');

import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ZACR_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'), 
          signOptions: { expiresIn: '24h' },
        } as JwtModuleOptions;
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }), 
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'SNOWFLAKE_CONNECTION',
      useFactory: () => {
        const connection = snowflake.createConnection({
          account: process.env.SNOWFLAKE_ACCOUNT,
          username: process.env.SNOWFLAKE_USERNAME,
          password: process.env.SNOWFLAKE_PASSWORD,
          role: process.env.SNOWFLAKE_ROLE,
          warehouse: process.env.SNOWFLAKE_WAREHOUSE,
          database: process.env.SNOWFLAKE_DATABASE,
          schema: process.env.SNOWFLAKE_SCHEMA,
        });

        // Try to connect to Snowflake, and check whether the connection was successful.
        connection.connect((err, conn) => {
          if (err) {
            console.error('Unable to connect: ' + err.message);
            throw err;
          } else {
            console.log('Successfully connected to Snowflake.');
          }
        });

        return connection;
      },
    },
    TransactionService
  ],
  exports: [TransactionService],
})
export class AppModule {}
