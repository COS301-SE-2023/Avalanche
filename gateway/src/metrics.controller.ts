import { Controller, Get } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { httpRequestDurationMicroseconds, httpRequestsTotal } from './user-management/user-mangement.controller';
import { httpRequestDurationMicrosecondsZACR, httpRequestsTotalZACR } from './zacr/zacr.controller';
import { httpRequestDurationMicrosecondsAfrica, httpRequestsTotalAfrica } from './africa/africa.controller';
import { httpRequestDurationMicrosecondsRyce, httpRequestsTotalRyce } from './ryce/ryce.controller';
import { httpRequestDurationMicrosecondsDW, httpRequestsTotalDW } from './domain-watch/domain-watch.controller';

@Controller('metrics')
export class MetricsController {
  private readonly register: Registry;

  constructor() {
    this.register = new Registry();
    collectDefaultMetrics({ register: this.register });
    this.register.registerMetric(httpRequestsTotal);
    this.register.registerMetric(httpRequestDurationMicroseconds);
    this.register.registerMetric(httpRequestsTotalZACR);
    this.register.registerMetric(httpRequestDurationMicrosecondsZACR);
    this.register.registerMetric(httpRequestsTotalAfrica);
    this.register.registerMetric(httpRequestDurationMicrosecondsAfrica);
    this.register.registerMetric(httpRequestsTotalRyce);
    this.register.registerMetric(httpRequestDurationMicrosecondsRyce);
    this.register.registerMetric(httpRequestsTotalDW);
    this.register.registerMetric(httpRequestDurationMicrosecondsDW);
  }

  @Get()
  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
