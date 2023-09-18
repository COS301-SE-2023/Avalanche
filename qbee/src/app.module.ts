/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisProvider } from './redis.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { PermissionsService } from './services/permission.service';
import { SchemaService } from './services/schema.service';
import { QueryBuilderService } from './services/queryBuilder.service';
import { SQLTranslatorService } from './services/sqlTranslator.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QBEE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST || 'localhost',
          port: 4102,
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
  providers: [AppService, RedisProvider, PermissionsService, SchemaService, QueryBuilderService, SQLTranslatorService],
  exports: [],
})
export class AppModule { }
