/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('africa')
export class AfricaController {
  constructor(@Inject('AFRICA_SERVICE') private client: ClientProxy) {}

  @Post('transactions')
  @HttpCode(200)
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
  @HttpCode(200)
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
  @HttpCode(200)
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
  @HttpCode(200)
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
  @HttpCode(200)
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
  @HttpCode(200)
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

  @Post('movement/vertical')
  @HttpCode(200)
  async movementVertical(@Body() data: any) {
    const pattern = { cmd: 'movement/vertical' };
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
  @HttpCode(200)
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