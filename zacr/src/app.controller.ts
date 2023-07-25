/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';
import { DomainNameAnalysisService } from './domainNameAnalysis/domain-name-analysis.service';
import { MovementService } from './movement/movement.service';
import { DomainWatchService } from './domainWatch/domain-watch-analysis.service';
import { RegistrarNameService } from './registrarName/registrarName.service';
@Controller('zacr')
export class AppController {
  constructor(private readonly transactionsService: TransactionService, 
    private readonly marketShareService : MarketShareService,
    private readonly ageService : AgeService,
    private readonly domainNameAnalysisService : DomainNameAnalysisService,
    private readonly movementService: MovementService,
    private readonly domainWatchService : DomainWatchService,
    private readonly registrarNameService: RegistrarNameService) {}

  @MessagePattern({ cmd: 'transactions' })
  async transactions(data: any) {
    console.log('Transactions: ', data);
    const result = await this.transactionsService.transactions(data.filters,data.graphName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'transactions-ranking' })
  async transactionsRanking(data: any) {
    console.log('Transactions: ', data);
    const result = await this.transactionsService.transactionsRanking(data.filters,data.graphName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'marketShare' })
  async marketShare(data: any) {
    const result = await this.marketShareService.marketShare(data.filters,data.graphName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'age' })
  async age(data: any) {
    const result = await this.ageService.age(data.filters,data.graphName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'domainNameAnalysis/count' })
  async domainNameAnalysisCount(data: any) {
    const result = await this.domainNameAnalysisService.sendData(data);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result['timestamp'],
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'domainNameAnalysis/length' })
  async domainNameAnalysisLength(data: any) {
    const result = await this.domainNameAnalysisService.sendData(data);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'movement/vertical' })
  async nettVerticalMovement(data: any) {
    return await this.movementService.nettVeritical(
      data.filters,
      data.graphName,
    );
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
