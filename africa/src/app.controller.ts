/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { TransactionService } from './transactions/transactions.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';
import { DomainNameAnalysisService } from './domainNameAnalysis/domain-name-analysis.service';
import { DomainWatchService } from './domainWatch/domain-watch-analysis.service';
import { RegistrarNameService } from './registrarName/registrarName.service';
import { MovementService } from './movement/movement.service';

@Controller('africa')
export class AppController {
  constructor(private readonly transactionsService: TransactionService, 
    private readonly marketShareService : MarketShareService,
    private readonly ageService : AgeService,
    private readonly domainNameAnalysisService : DomainNameAnalysisService,
    private readonly domainWatchService : DomainWatchService,
    private readonly registrarNameService: RegistrarNameService,
    private readonly movementService: MovementService) {}

  @MessagePattern({ cmd: 'transactions' })
  async transactions(data: any) {
    console.log('Transactions: ', data);
    const result = await this.transactionsService.transactions(data.filters,data.graphName);
    console.log('Transactions result: ', result);
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
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'domainNameAnalysis/length' })
  async domainNameAnalysisLength(data: any) {
    const result = await this.domainNameAnalysisService.domainLength(data.filters, data.graphName);
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
    const result =  await this.movementService.nettVeritical(
      data.filters,
      data.graphName,
    );

    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  //internal
  @MessagePattern({ cmd: 'domainWatchPassive' })
  async domainWatchPassive() {
    const result = await this.domainWatchService.passive();
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  //internal
  @MessagePattern({ cmd: 'loadDomains' })
  async loadDomains() {
    const result = await this.domainWatchService.loadDomains();
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  //internal
  @MessagePattern({ cmd: 'registrarName' })
  async registarName(data: any) {
    const result = await this.registrarNameService.registrarName(data);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
}
