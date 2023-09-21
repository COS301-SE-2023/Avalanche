/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Counter, Histogram, Registry } from 'prom-client';
import { lastValueFrom } from 'rxjs';
import { QbeeService } from './qbee.service';

const register = new Registry();
export const httpRequestDurationMicrosecondsQBEE = new Histogram({
  name: 'http_request_duration_secondsQBEE',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1],
});

export const httpRequestsTotalQBEE = new Counter({
  name: 'http_requests_totalQBEE',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(httpRequestDurationMicrosecondsQBEE);
register.registerMetric(httpRequestsTotalQBEE);

@Controller('qbee')
export class QbeeController {
  constructor(@Inject('QBEE_SERVICE') private client: ClientProxy,
  private readonly qbeeService: QbeeService) {}

  @Post('zarc')
  @HttpCode(200)
  async transactions(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsQBEE.startTimer();
    const pattern = { cmd: 'qbee' };
    const payload = data;
    try {
      const result = await this.qbeeService.zarc(payload);
      httpRequestsTotalQBEE.inc({ method: 'POST', route: 'zarc', code: 200 });
      end({ method: 'POST', route: 'zarc', code: 200 });

      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalQBEE.inc({ method: 'POST', route: 'zarc', code: rpcError.status });
      end({ method: 'POST', route: 'zarc', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('getSchema')
  @HttpCode(200)
  async getSchema(@Body() data: any) {
    const end = httpRequestDurationMicrosecondsQBEE.startTimer();
    const pattern = { cmd: 'getSchema' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotalQBEE.inc({ method: 'POST', route: 'getSchema', code: 200 });
      end({ method: 'POST', route: 'getSchema', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error
      httpRequestsTotalQBEE.inc({ method: 'POST', route: 'getSchema', code: rpcError.status });
      end({ method: 'POST', route: 'getSchema', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}