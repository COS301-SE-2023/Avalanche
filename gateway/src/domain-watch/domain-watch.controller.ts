/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { DomainWatchService } from './domain-watch.service';

@Controller('domain-watch')
export class DomainWatchController {
  constructor(private readonly domainWatchService: DomainWatchService) {}

  @Post('list')
  async sendData(@Body() data: any) {
    const result = await this.domainWatchService.sendData(data);
    return result;
  }
}