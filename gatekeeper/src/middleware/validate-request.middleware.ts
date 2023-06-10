/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ValidateRequestMiddleware implements NestMiddleware {
    private ajv = new Ajv();
    private schemas: Record<string, Ajv.ValidateFunction> = {};

  constructor() {
    // Load JSON schemas from a directory on initialization
    const projectRoot = path.resolve(__dirname, '../..');
    const schemasDir = path.join(projectRoot, 'src/middleware/schemas');
    this.loadSchemas(schemasDir, '');
  }
  private loadSchemas(dir: string, prefix: string) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.resolve(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        this.loadSchemas(filePath, `${prefix}/${file}`);
      } else if (stats.isFile() && path.extname(file) === '.json') {
        const schema = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const url = `${prefix}/${path.basename(file, '.json')}`;
        this.schemas[url] = this.ajv.compile(schema);
      }
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.originalUrl);
    const validate = this.schemas[req.originalUrl];
    if (!validate) {
      return res.status(400).send({ error: `No schema found for path ${req.path}` });
    }
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).send({ error: 'Invalid request body'});
    }
    next();
  }
}
