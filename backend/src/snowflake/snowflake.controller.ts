/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';
import { JWTAuthGuard as AuthGuard } from '../auth/jwt.guard';

@Controller('snowflake')
@UseGuards(AuthGuard)
export class SnowflakeController {
  constructor(private readonly snowflakeService: SnowflakeService) {}

  @Post('fetch-data')
  async fetchData(
    @Body('table') table: string,
    @Body('limit') limit: number,
    @Body('type') type: string,
  ): Promise<any> {
    if (!table) {
      throw new HttpException('Table name is required.', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.snowflakeService.fetchData(type,table, limit);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { success: false, error: error.message };
    }
  }
}