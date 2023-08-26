/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import * as fs from 'fs';

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
        const privilegesJson = [{
          "zacr": [{ "public": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length"] },
          { "registrar": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length", "transactions", "transactions-ranking"] },
          { "registry": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length", "transactions", "transactions-ranking"] }]
        },
        {
          "africa": [{ "public": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length"] },
          { "registrar": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length", "transactions", "transactions-ranking"] },
          { "registry": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length", "transactions", "transactions-ranking"] }]
        },
        {
          "ryce": [{ "public": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length"] },
          { "registrar": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length", "transactions", "transactions-ranking"] },
          { "registry": ["age", "movement/vertical", "domainNameAnalysis/count", "domainNameAnalysis/length", "transactions", "transactions-ranking"] }]
        }
        ];
        const privileges = privilegesJson;
        if (req.baseUrl.startsWith("/domain-watch") || req.baseUrl.startsWith("/domain-name-analysis")) {
          delete req.body.token;
          next();
        }
        if (req.baseUrl.startsWith("/zacr")) {
          const productType = userDetails.products[0].tou; // assuming this is the user's level
          const accessLevel = privileges[0]['zacr'];
          const privilegesForProductType = accessLevel.find((privilege) => privilege[productType]);
          const result = privilegesForProductType[productType];
          if (!result.includes(req.baseUrl.split('/')[2])) {
            return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
          }
          if (productType == 'registrar') {
            if (req.body.registrar && req.body.registrar.length === 1) {
              if (req.body.registrar[0] === "Individual") {
                req.body.registrar = [userDetails.products[0].key];
              } else if (req.body.registrar[0] === "All") {
                delete req.body.registrar;
              } else {
                return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
              }
            } else {
              return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
            }
          }
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
        } else if (req.baseUrl.startsWith('/africa')) {
          const productType = userDetails.products[1].tou; // assuming this is the user's level
          const accessLevel = privileges[1]['africa']
          const privilegesForProductType = accessLevel.find((privilege) => privilege[productType]);
          const result = privilegesForProductType[productType];
          if (!result.includes(req.baseUrl.split('/')[2])) {
            return res.status(403).json({ status: 'failure', message: 'Access Forbidden', timestamp: new Date().toISOString() });
          }
          if (productType == 'registrar') {
            if (req.body.registrar && req.body.registrar.length === 1) {
              if (req.body.registrar[0] === "Individual") {
                req.body.registrar = [userDetails.products[0].key];
              } else if (req.body.registrar[0] === "All") {
                delete req.body.registrar;
              } else {
                return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
              }
            } else {
              return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
            }
          }
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
        } else if (req.baseUrl.startsWith('/ryce')) {
          const productType = userDetails.products[2].tou; // assuming this is the user's level
          const accessLevel = privileges['ryce'];
          const privilegesForProductType = accessLevel.find((privilege) => privilege[productType]);
          const result = privilegesForProductType[productType];
          if (!result.includes(req.baseUrl.split('/')[2])) {
            return res.status(403).json({ status: 'failure', message: 'Access Forbidden', timestamp: new Date().toISOString() });
          }
          if (productType == 'registrar') {
            if (req.body.registrar && req.body.registrar.length === 1) {
              if (req.body.registrar[0] === "Individual") {
                req.body.registrar = [userDetails.products[0].key];
              } else if (req.body.registrar[0] === "All") {
                delete req.body.registrar;
              } else {
                return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
              }
            } else {
              return res.status(403).json({ status: 403, message: 'Access Forbidden', timestamp: new Date().toISOString() });
            }
          }
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
