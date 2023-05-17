/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RedisProvider } from './redis.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AuthService, RedisProvider],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
