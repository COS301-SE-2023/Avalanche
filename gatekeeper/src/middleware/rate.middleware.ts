// dynamic-rate-limit.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DynamicRateLimitMiddleware implements NestMiddleware {
  private static ipCounter = new Map<string, { count: number, timer: NodeJS.Timeout }>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const entry = DynamicRateLimitMiddleware.ipCounter.get(ip);

    if (entry) {
      // Update the counter for this IP and reset the timer
      entry.count += 1;
      clearTimeout(entry.timer);
      entry.timer = setTimeout(() => {
        DynamicRateLimitMiddleware.ipCounter.delete(ip);
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      // New IP, set counter and timer
      DynamicRateLimitMiddleware.ipCounter.set(ip, {
        count: 1,
        timer: setTimeout(() => {
          DynamicRateLimitMiddleware.ipCounter.delete(ip);
        }, 5 * 60 * 1000) // 5 minutes
      });
    }

    // Get the number of unique IPs
    const uniqueIps = DynamicRateLimitMiddleware.ipCounter.size;

    // Dynamic rate limit configuration based on unique IPs
    const rateLimitConfig = {
      windowMs: 60 * 1000, // 1 minute
      max: Math.max(5000 / uniqueIps, 10), // At least 10 requests are allowed
      message: "{'error': 'Too many requests, please try again later.'}",
    };

    // Apply rate limiting
    rateLimit(rateLimitConfig)(req, res, next);
  }
}

