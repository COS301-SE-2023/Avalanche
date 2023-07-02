/* eslint-disable prettier/prettier */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('zacr')
export class ZacrController {
  constructor(@Inject('ZACR_SERVICE') private client: ClientProxy) {}

  @Post('transactions')
  async transactions(@Body() data: any) {
    const pattern = { cmd: 'transactions' };
    console.log("here")
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }

  @Post('transactions-ranking')
  async transactionsRaking(@Body() data: any) {
    const pattern = { cmd: 'transactions-ranking' };
    console.log("here")
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }

  @Post('marketShare')
  async marketShare(@Body() data: any) {
    const pattern = { cmd: 'marketShare' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }

  @Post('age')
  async age(@Body() data: any) {
    const pattern = { cmd: 'age' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }

  @Post('domainNameAnalysis/count')
  async domainNameAnalysisCount(@Body() data: any) {
    const pattern = { cmd: 'domainNameAnalysis/count' };
    const payload = data;
    const result = await lastValueFrom(this.client.send(pattern, payload));
    return result;
  }
}