/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('africa')
export class AfricaController {
  constructor(@Inject('AFRICA_SERVICE') private client: ClientProxy) {}

  @Post('transactions')
  async transactions(@Body() data: any) {
    const pattern = { cmd: 'transactions' };
    console.log("here")
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('transactions-ranking')
  async transactionsRaking(@Body() data: any) {
    const pattern = { cmd: 'transactions-ranking' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('marketShare')
  async marketShare(@Body() data: any) {
    const pattern = { cmd: 'marketShare' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('age')
  async age(@Body() data: any) {
    const pattern = { cmd: 'age' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('domainNameAnalysis/count')
  async domainNameAnalysisCount(@Body() data: any) {
    const pattern = { cmd: 'domainNameAnalysis/count' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('domainNameAnalysis/length')
  async domainNameAnalysisLength(@Body() data: any) {
    const pattern = { cmd: 'domainNameAnalysis/length' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('domainWatchPassive')
  async domainWatchPassive(@Body() data: any) {
    const pattern = { cmd: 'domainWatchPassive' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}