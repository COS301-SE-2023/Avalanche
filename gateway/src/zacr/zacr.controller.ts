/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Counter, Histogram, Registry } from 'prom-client';
import { lastValueFrom } from 'rxjs';
import * as cron from 'node-cron';

const register = new Registry();
export const httpRequestDurationMicrosecondsZACR = new Histogram({
  name: 'http_request_duration_secondsZARC',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1],
});

export const httpRequestsTotalZACR = new Counter({
  name: 'http_requests_totalZARC',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(httpRequestDurationMicrosecondsZACR);
register.registerMetric(httpRequestsTotalZACR);

@Controller('zacr')
export class ZacrController {
  constructor(@Inject('ZACR_SERVICE') private client: ClientProxy) { }
  onModuleInit() {
    this.scheduleClassification();
  }
  @Post('qbee')
  @HttpCode(200)
  async qbee(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'qbee' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'qbee', code: 200 });
      end({ method: 'POST', route: 'qbee', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'qbee', code: rpcError.status });
      end({ method: 'POST', route: 'qbee', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('transactions')
  @HttpCode(200)
  async transactions(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'transactions' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'transactions', code: 200 });
      end({ method: 'POST', route: 'transactions', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'transactions', code: rpcError.status });
      end({ method: 'POST', route: 'transactions', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('registrar')
  @HttpCode(200)
  async registar(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'transactions' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'registrar', code: 200 });
      end({ method: 'POST', route: 'registrar', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'registrar', code: rpcError.status });
      end({ method: 'POST', route: 'registrar', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('transactions-ranking')
  @HttpCode(200)
  async transactionsRaking(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'transactions-ranking' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'transactions-ranking', code: 200 });
      end({ method: 'POST', route: 'transactions-ranking', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'transactions-ranking', code: rpcError.status });
      end({ method: 'POST', route: 'transactions-ranking', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('marketShare')
  @HttpCode(200)
  async marketShare(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'marketShare' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'marketShare', code: 200 });
      end({ method: 'POST', route: 'marketShare', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'marketShare', code: rpcError.status });
      end({ method: 'POST', route: 'marketShare', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('age')
  @HttpCode(200)
  async age(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'age' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'age', code: 200 });
      end({ method: 'POST', route: 'age', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'age', code: rpcError.status });
      end({ method: 'POST', route: 'age', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('domainNameAnalysis/count')
  @HttpCode(200)
  async domainNameAnalysisCount(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'domainNameAnalysis/count' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/count', code: 200 });
      end({ method: 'POST', route: 'domainNameAnalysis/count', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/count', code: rpcError.status });
      end({ method: 'POST', route: 'domainNameAnalysis/count', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('domainNameAnalysis/classification')
  @HttpCode(200)
  async domainNameAnalysisClassification(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'domainNameAnalysis/classification' };

    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/classification', code: 200 });
      end({ method: 'POST', route: 'domainNameAnalysis/classification', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/classification', code: rpcError.status });
      end({ method: 'POST', route: 'domainNameAnalysis/classification', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  private async scheduleClassification() {
    cron.schedule('30 5 * * *', async () => {
      const dataO = { filters : {num : 1, granularity: "week"}};

      const end = httpRequestDurationMicrosecondsZACR.startTimer();
      const pattern = { cmd: 'domainNameAnalysis/classification' };

      const payload = dataO;
      try {
        const result = await lastValueFrom(this.client.send(pattern, payload));
        httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/classification cron', code: 200 });
        end({ method: 'POST', route: 'domainNameAnalysis/classification cron', code: 200 });
        return result;
      } catch (error) {
        const rpcError = error
        httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/classification cron', code: rpcError.status });
        end({ method: 'POST', route: 'domainNameAnalysis/classification cron', code: rpcError.status });
        if (typeof rpcError === 'object') {
          throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
        }
        throw error;
      }
    },{
      scheduled: true,
      timezone: "Africa/Johannesburg" // Optional, set the time zone
    });
  }

  @Post('domainNameAnalysis/length')
  @HttpCode(200)
  async domainNameAnalysisLength(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'domainNameAnalysis/length' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/length', code: 200 });
      end({ method: 'POST', route: 'domainNameAnalysis/length', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainNameAnalysis/length', code: rpcError.status });
      end({ method: 'POST', route: 'domainNameAnalysis/length', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('movement/vertical')
  @HttpCode(200)
  async movementVertical(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'movement/vertical' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'movement/vertical', code: 200 });
      end({ method: 'POST', route: 'movement/vertical', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'movement/vertical', code: rpcError.status });
      end({ method: 'POST', route: 'movement/vertical', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('movement/verticalRanked')
  @HttpCode(200)
  async movementVerticalRanked(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'movement/verticalRanked' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'movement/verticalRanked', code: 200 });
      end({ method: 'POST', route: 'movement/verticalRanked', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'movement/verticalRanked', code: rpcError.status });
      end({ method: 'POST', route: 'movement/verticalRanked', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('domainWatchPassive')
  @HttpCode(200)
  async domainWatchPassive(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsZACR.startTimer();
    const pattern = { cmd: 'domainWatchPassive' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainWatchPassive', code: 200 });
      end({ method: 'POST', route: 'domainWatchPassive', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalZACR.inc({ method: 'POST', route: 'domainWatchPassive', code: rpcError.status });
      end({ method: 'POST', route: 'domainWatchPassive', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}