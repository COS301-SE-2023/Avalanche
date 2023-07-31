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
      const token = req.headers.authorization?.split(' ')[1];
      // Get user's information from Redis by token
      let userInfo: any;
      try {
        userInfo = await this.redis.get(token);
      } catch (e) {
        res.status(401).json({ status: 'failure', message: e.message, timestamp: new Date().toISOString() });
      }

      if (!userInfo) {
        res.status(401).json({ status: 'failure', message: 'JWT invalid', timestamp: new Date().toISOString() });
      } else {
        // Add token to the request body
        if (req.baseUrl.startsWith("/domain-watch") || req.baseUrl.startsWith("/domain-name-analysis")) {
          next();
        }
        if (req.baseUrl.startsWith("/zacr") || req.baseUrl.startsWith('/africa') || req.baseUrl.startsWith('/ryce')) {
          const graphName1 = req.body.graphName;
          const minNum = req.body.minimumAppearances;
          delete req.body.minimumAppearances;
          delete req.body.graphName;
          if (!req.body.filters) {
            req.body = { filters: req.body };
            req.body.graphName = graphName1;
            req.body.minimumAppearances = minNum;
            console.log(req.body);
            next();
          } else {
            req.body.graphName = graphName1;
            req.body.minimumAppearances = minNum;
            console.log(req.body);
            next();
          }
        } else {
          req.body.token = token;
          next();
        }
      }
    } catch (error) {
      res.status(401).json({ status: 'failure', message: error.message, timestamp: new Date().toISOString() });
    }
  }
}
