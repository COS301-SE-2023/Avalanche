/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Ajv from 'ajv';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ValidateRequestMiddleware implements NestMiddleware {
  private ajv = new Ajv();

  constructor(private readonly httpService: HttpService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.originalUrl);

    // Replace with the actual URL of the hades instance, appending the endpoint URL
    const hadesUrl = `${process.env.HADES ? `http://hades:3997` : "http://localhost:3997"}${req.originalUrl}`;
    console.log(hadesUrl);

    try {
      const response = await this.httpService.get(hadesUrl).toPromise();
      const schema = response.data;

      const validate = this.ajv.compile(schema);
      const valid = validate(req.body);
      if (!valid) {
        return res.status(400).send({ error: 'Invalid request body' });
      }
    } catch (error) {
      // console.error(`Failed to get schema for URL ${req.originalUrl}:`, error.message);
      return res.status(400).send({ error: `No schema found for path ${req.path}` });
    }

    next();
  }
}
