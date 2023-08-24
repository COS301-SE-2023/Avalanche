/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, HttpException } from '@nestjs/common';
import { DomainWatchService } from './domain-watch.service';

@Controller('domain-watch')
export class DomainWatchController {
  constructor(private readonly domainWatchService: DomainWatchService) { }

  @Post('list')
  @HttpCode(200)
  async sendData(@Body() data: any) {
    try {
      const result = await this.domainWatchService.sendData(data);
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('whoisyou')
  @HttpCode(200)
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