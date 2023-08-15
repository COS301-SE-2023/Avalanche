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

  @Post('editFilter')
  editFilterData(@Body() data: any): Object {
    return this.appService.editFilterData(data);
  }

  @Post('editGraph')
  editGraphData(@Body() data: any): Object {
    return this.appService.editGraphData(data);
  }

  @Post('editEndpoint')
  editEndpointData(@Body() data: any): Object {
    return this.appService.editEndpointData(data);
  }
}
