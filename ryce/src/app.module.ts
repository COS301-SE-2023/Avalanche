/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import * as snowflake from "snowflake-sdk";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';
import { RedisProvider } from './redis.provider';
import { AnalysisService } from './analysis/analysis.service';
import { GraphFormatService } from './graph-format/graph-format.service';
import { SnowflakeService } from './snowflake/snowflake.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';
import { DomainNameAnalysisService } from './domainNameAnalysis/domain-name-analysis.service';
import { HttpModule } from '@nestjs/axios';
import { MovementService } from './movement/movement.service';
import { RegistrarNameService } from './registrarName/registrarName.service';
import { DomainWatchService } from './domainWatch/domain-watch-analysis.service';
import { QBeeService } from './qbee/qbee.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'RyCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST || 'localhost',
          port: 4004,
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
  providers: [RedisProvider,
    {
      provide: 'SNOWFLAKE_CONNECTION',
      useFactory: () => {
        let connection;

        const reconnect = () => {
          console.log('Attempting to reconnect...');
          initConnection();
        };

        const initConnection = () => {
          connection = snowflake.createConnection({
            account: process.env.SNOWFLAKE_ACCOUNT,
            username: process.env.SNOWFLAKE_USERNAME,
            password: process.env.SNOWFLAKE_PASSWORD,
            role: process.env.SNOWFLAKE_ROLE,
            warehouse: process.env.SNOWFLAKE_WAREHOUSE,
            database: process.env.SNOWFLAKE_DATABASE,
            schema: process.env.SNOWFLAKE_SCHEMA,
          });

          connection.on('error', (err) => {
            reconnect();
          });

          connection.connect((err) => {
            if (err) {
              reconnect();
            } else {
              console.log('Successfully connected to Snowflake.');
            }
          });
        };

        // Initialize the connection for the first time
        initConnection();

        return connection;
      },
    },
    TransactionService,
    MarketShareService,
    AgeService,
    DomainNameAnalysisService,
    GraphFormatService,
    SnowflakeService,
    MovementService,
    RegistrarNameService,
    DomainWatchService,
    QBeeService
  ],
  exports: [TransactionService, MarketShareService, AgeService, DomainNameAnalysisService, GraphFormatService, SnowflakeService, MovementService, RegistrarNameService, DomainWatchService, QBeeService],
})
export class AppModule { }
