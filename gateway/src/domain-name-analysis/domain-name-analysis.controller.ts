/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { DomainNameAnalysisService } from './domain-name-analysis.service';

@Controller('domain-name-analysis')
export class DomainNameAnalysisController {
  constructor(private readonly domainNameAnalysisService: DomainNameAnalysisService) {}

  @Post('list')
  async sendData(@Body() data: any) {
    const result = await this.domainNameAnalysisService.sendData(data);
    return result;
  }
}