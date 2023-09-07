/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, HttpException } from '@nestjs/common';
import { DomainWatchService } from './domain-watch.service';
import { Counter, Histogram, Registry } from 'prom-client';

const register = new Registry();
export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1],
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);

@Controller('domain-watch')
export class DomainWatchController {
  constructor(private readonly domainWatchService: DomainWatchService) { }

  @Post('list')
  async sendData(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    try {
      const result = await this.domainWatchService.sendData(data);
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: 200 });
      end({ method: 'POST', route: 'list', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: rpcError.status });
      end({ method: 'POST', route: 'list', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('whoisyou')
  async whoisyou(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    try {
      const result = await this.domainWatchService.whoisyou(data);
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: 200 });
      end({ method: 'POST', route: 'list', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: rpcError.status });
      end({ method: 'POST', route: 'list', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Get('passive')
  async passive() {
    const end = httpRequestDurationMicroseconds.startTimer();
    try {
      const result = await this.domainWatchService.passive();
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: 200 });
      end({ method: 'POST', route: 'list', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: rpcError.status });
      end({ method: 'POST', route: 'list', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Get('loadDomains')
  async loadDomains() {
    const end = httpRequestDurationMicroseconds.startTimer();
    try {
      const result = await this.domainWatchService.loadDomains();
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: 200 });
      end({ method: 'POST', route: 'list', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotal.inc({ method: 'POST', route: 'list', code: rpcError.status });
      end({ method: 'POST', route: 'list', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}