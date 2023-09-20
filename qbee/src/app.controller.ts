import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import { QueryBuilderService } from './services/queryBuilder.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly qBeeService: QueryBuilderService,
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
}
