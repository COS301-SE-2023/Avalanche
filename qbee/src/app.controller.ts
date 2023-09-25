import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import { QueryBuilderService } from './services/queryBuilder.service';
import { PermissionsService } from './services/permission.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly qBeeService: QueryBuilderService,
    private readonly permissionService: PermissionsService
  ) {}

  @MessagePattern({ cmd: 'qbee' })
  async executeQbeeQuery(data: any) {
    const result = await this.qBeeService.constructQuery(data.query, data.token, data.schema, data.dataSource);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'getSchema' })
  async getSchema(data: any) {
    const result = await this.permissionService.getSchema(data.token, data.schema, data.dataSource);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
}
