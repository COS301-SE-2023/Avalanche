/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';

@Module({
  providers: [SnowflakeService],
  exports: [SnowflakeService],
})
export class SnowflakeModule {}
