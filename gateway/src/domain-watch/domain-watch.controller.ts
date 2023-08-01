/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get } from '@nestjs/common';
import { DomainWatchService } from './domain-watch.service';

@Controller('domain-watch')
export class DomainWatchController {
  constructor(private readonly domainWatchService: DomainWatchService) { }

  @Post('list')
  async sendData(@Body() data: any) {
    const result = await this.domainWatchService.sendData(data);
    return result;
  }

  @Post('whoisyou')
  async whoisyou(@Body() data: any) {
    const result = await this.domainWatchService.whoisyou(data);
    return result;
  }
  @Get('passive')
  async passive() {
    const result = await this.domainWatchService.passive();
    return result;
  }

  @Get('loadDomains')
  async loadDomains() {
    const result = await this.domainWatchService.loadDomains();
    return result;
  }
}