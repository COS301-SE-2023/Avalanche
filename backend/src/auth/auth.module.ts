/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RedisProvider } from './redis.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';


@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: +configService.get<number>('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    inject: [ConfigService],
  }), TypeOrmModule.forFeature([User]),],
  providers: [AuthService, RedisProvider],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

