import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Endpoint } from './entity/endpoint.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('addData')
  sendEndPointData(@Body() data: any): Object {
    return this.appService.seedEndpointData(data);
  }

  @Get('getData')
  async getAllData() {
    return await this.appService.getAllData();
  }

  @Post('editData')
  editEndPointData(@Body() data: any): Object {
    return this.appService.editEndpointData(data);
  }
}
