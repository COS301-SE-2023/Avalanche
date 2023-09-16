/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisProvider } from './redis.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Endpoint } from './entity/endpoint.entity';
import { Graph } from './entity/graph.entity';
import { Filter } from './entity/filter.entity';
import { AppService } from './app.service';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        schema: configService.get('POSTGRES_SCHEMA'),
        entities: [Endpoint, Filter, Graph], // We change entities to an array that includes the User entity. 
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Endpoint, Filter, Graph]),

  ],
  controllers: [AppController],
  providers: [AppService, RedisProvider],
  exports: [],
})
export class AppModule { }
