/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';
import { DomainNameAnalysisService } from './domainNameAnalysis/domain-name-analysis.service';
import { DomainWatchService } from './domainWatch/domain-watch-analysis.service';
import { RegistrarNameService } from './registrarName/registrarName.service';

@Controller('africa')
export class AppController {
  constructor(private readonly transactionsService: TransactionService, 
    private readonly marketShareService : MarketShareService,
    private readonly ageService : AgeService,
    private readonly domainNameAnalysisService : DomainNameAnalysisService,
    private readonly domainWatchService : DomainWatchService,
    private readonly registrarNameService: RegistrarNameService) {}

  @MessagePattern({ cmd: 'transactions' })
  async transactions(data: any) {
    console.log('Transactions: ', data);
    return await this.transactionsService.transactions(data.filters,data.graphName);
  }

  @MessagePattern({ cmd: 'transactions-ranking' })
  async transactionsRanking(data: any) {
    console.log('Transactions: ', data);
    return await this.transactionsService.transactionsRanking(data.filters,data.graphName);
  }

  @MessagePattern({ cmd: 'marketShare' })
  async marketShare(data: any) {
    return await this.marketShareService.marketShare(data.filters,data.graphName);
  }

  @MessagePattern({ cmd: 'age' })
  async age(data: any) {
    return await this.ageService.age(data.filters,data.graphName);
  }

  @MessagePattern({ cmd: 'domainNameAnalysis/count' })
  async domainNameAnalysisCount(data: any) {
    return await this.domainNameAnalysisService.sendData(data);
  }

  @MessagePattern({ cmd: 'domainNameAnalysis/length' })
  async domainNameAnalysisLength(data: any) {
    return await this.domainNameAnalysisService.sendData(data);
  }

  @MessagePattern({ cmd: 'domainWatchPassive' })
  async domainWatchPassive() {
    return await this.domainWatchService.passive();
  }

  @MessagePattern({ cmd: 'loadDomains' })
  async loadDomains() {
    return await this.domainWatchService.loadDomains();
  }

  @MessagePattern({ cmd: 'registrarName' })
  async registarName(data: any) {
    return await this.registrarNameService.registrarName(data);
  }
}
