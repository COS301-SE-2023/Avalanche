/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(' ')[1];

      // Get user's information from Redis by token
      const userInfo = await this.redis.get(token);

      if (!userInfo) {
        throw new Error('Invalid Token');
      }
      next();
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}
