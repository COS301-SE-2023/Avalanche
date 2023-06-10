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
}