import { Controller, Get } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { httpRequestDurationMicroseconds, httpRequestsTotal } from './user-management/user-mangement.controller';
import { httpRequestDurationMicroseconds as httpRequestDurationMicrosecondsZARC, httpRequestsTotal as httpRequestsTotalZARC } from './zacr/zacr.controller';
import { httpRequestDurationMicroseconds as httpRequestDurationMicrosecondsAfrica, httpRequestsTotal as httpRequestsTotalAfrica } from './africa/africa.controller';
import { httpRequestDurationMicroseconds as httpRequestDurationMicrosecondsRyCE, httpRequestsTotal as httpRequestsTotalRyCE } from './ryce/ryce.controller';
import { httpRequestDurationMicroseconds as httpRequestDurationMicrosecondsDW, httpRequestsTotal as httpRequestsTotalDW } from './domain-watch/domain-watch.controller';

@Controller('metrics')
export class MetricsController {
  private readonly register: Registry;

  constructor() {
    this.register = new Registry();
    collectDefaultMetrics({ register: this.register });
    this.register.registerMetric(httpRequestsTotal);
    this.register.registerMetric(httpRequestDurationMicroseconds);
    this.register.registerMetric(httpRequestsTotalZARC);
    this.register.registerMetric(httpRequestDurationMicrosecondsZARC);
    this.register.registerMetric(httpRequestsTotalAfrica);
    this.register.registerMetric(httpRequestDurationMicrosecondsAfrica);
    this.register.registerMetric(httpRequestsTotalRyCE);
    this.register.registerMetric(httpRequestDurationMicrosecondsRyCE);
    this.register.registerMetric(httpRequestsTotalDW);
    this.register.registerMetric(httpRequestDurationMicrosecondsDW);
  }

  @Get()
  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
