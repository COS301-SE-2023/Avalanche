/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';

@Controller('zacr')
export class AppController {
  constructor(private readonly transactionsService: TransactionService, 
    private readonly marketShareService : MarketShareService,
    private readonly ageService : AgeService) {}

  @MessagePattern({ cmd: 'transactions' })
  async transactions(data: any) {
    console.log('Transactions: ', data);
    return await this.transactionsService.transactions(data.jsonInput,data.graphName);
  }

  @MessagePattern({ cmd: 'marketShare' })
  async marketShare(data: any) {
    return await this.marketShareService.marketShare(data.jsonInput,data.graphName);
  }

  @MessagePattern({ cmd: 'age' })
  async age(data: any) {
    return await this.ageService.age(data.jsonInput,data.graphName);
  }
}
