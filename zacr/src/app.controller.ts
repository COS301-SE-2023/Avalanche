/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';

@Controller('zacr')
export class AppController {
  constructor(private readonly transactionsService: TransactionService) {}

  @MessagePattern({ cmd: 'transactions' })
  async register(data: any) {
    console.log('Transactions: ', data);
    return await this.transactionsService.transactions(data.jsonInput);
  }
}
