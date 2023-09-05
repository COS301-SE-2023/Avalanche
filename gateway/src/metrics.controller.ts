import { Controller, Get } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { httpRequestDurationMicroseconds, httpRequestsTotal } from './user-management/user-mangement.controller';

@Controller('metrics')
export class MetricsController {
  private readonly register: Registry;

  constructor() {
    this.register = new Registry();
    collectDefaultMetrics({ register: this.register });
    this.register.registerMetric(httpRequestsTotal);
    this.register.registerMetric(httpRequestDurationMicroseconds);
  }

  @Get()
  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
