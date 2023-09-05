/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ZacrService {
  constructor(
    @Inject('ZACR_SERVICE') private readonly client: ClientProxy,
  ) {}

  async transactions(data: any) {
    console.log("here: " + data);
    console.log('transactions')
    return this.client.send({ cmd: 'transactions' }, data).toPromise();
  }

  async transactionsRanking(data: any) {
    return this.client.send({ cmd: 'transactions-ranking' }, data).toPromise();
  }

  async marketShare(data: any) {
    return this.client.send({ cmd: 'marketShare' }, data).toPromise();
  }

  async age(data: any) {
    return this.client.send({ cmd: 'age' }, data).toPromise();
  }

  async domainNameAnalysisCount(data: any) {
    return this.client.send({ cmd: 'domainNameAnalysis/count' }, data).toPromise();
  }

  async domainNameAnalysisLength(data: any) {
    return this.client.send({ cmd: 'domainNameAnalysis/length' }, data).toPromise();
  }

  async movementVertical(data: any) {
    return this.client.send({ cmd: 'movement/vertical' }, data).toPromise();
  }

  async domainWatchPassive(data: any){
    return this.client.send({ cmd: 'domainWatchPassive'}, data).toPromise();
  }
}