/* eslint-disable prettier/prettier */
import { Body, Controller, Req, Res, All, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ForwardService } from './forward.service';
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

@Controller('*')
export class AppController {
  constructor(private readonly forwardService: ForwardService) {}

  @All()
  async handleAll(@Req() req: Request, @Body() body: any, @Res() res: Response) {
    const end = httpRequestDurationMicroseconds.startTimer();
    try {
      const data = await this.forwardService.forwardRequest(req.method, req.url, body, req.headers);
      return res.json(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      const errorCode = error.response?.data?.statusCode || 500;
      httpRequestsTotal.inc({ method: 'POST', route: 'gatekeeper', code: errorCode });
      end({ method: 'POST', route: 'gatekeeper', code: errorCode });
      throw new HttpException({ message: errorMessage, status: errorCode }, errorCode);
    }
  }
}

