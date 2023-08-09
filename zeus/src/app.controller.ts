import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  sendEndPointData(): Object {
    return this.appService.seedEndpointData();
  }

  @Get('data')
  async getAllData() {
    return await this.appService.getAllData();
  }
}
