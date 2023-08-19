/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(@Inject('REDIS') private readonly redis: Redis) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get token from header
      const token = req.body.token?.split(' ')[1];
      req.body.token = token;
      // Get user's information from Redis by token
      let userInfo: any;
      try {
        userInfo = await this.redis.get(token);
      } catch (e) {
        res.status(401).json({ status: 'failure', message: e.message, timestamp: new Date().toISOString() });
      }
      const userDetails = JSON.parse(userInfo);

      if (!userInfo) {
        res.status(401).json({ status: 'failure', message: 'JWT invalid', timestamp: new Date().toISOString() });
      } else {
        // Add token to the request body
        if (req.baseUrl.startsWith("/domain-watch") || req.baseUrl.startsWith("/domain-name-analysis")) {
          delete req.body.token;
          next();
        }
        if (req.baseUrl.startsWith("/zacr") || req.baseUrl.startsWith('/africa') || req.baseUrl.startsWith('/ryce')) {
          delete req.body.token;
          const graphName1 = req.body.graphName;
          const minNum = req.body.minimumAppearances;
          delete req.body.minimumAppearances;
          delete req.body.graphName;
          if (!req.body.filters) {
            req.body = { filters: req.body };
            req.body.graphName = graphName1;
            req.body.minimumAppearances = minNum;
            next();
          } else {
            req.body.graphName = graphName1;
            req.body.minimumAppearances = minNum;
            next();
          }
        } else {
          next();
        }
      }
    } catch (error) {
      res.status(401).json({ status: 'failure', message: error.message, timestamp: new Date().toISOString() });
    }
  }
}
