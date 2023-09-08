import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Registry, collectDefaultMetrics } from 'prom-client';
import { httpRequestDurationMicroseconds, httpRequestsTotal } from './app.controller';

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
    async getMetrics(@Res() res: Response): Promise<void> {
        res.setHeader('Content-Type', 'text/plain');
        res.end(await this.register.metrics());
    }
}

