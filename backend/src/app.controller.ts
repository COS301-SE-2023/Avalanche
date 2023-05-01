/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { SnowflakeService } from './snowflake/snowflake.service';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly snowflakeService: SnowflakeService) {}

  @Get('select')
  async select(@Query('query') query: string) {
    try {
      const result = await this.snowflakeService.select(query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
