import { Injectable } from '@nestjs/common';
import * as Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SchemaService {
  private ajv = new Ajv();
  private schemas: Record<string, any> = {};

  constructor() {
    const projectRoot = path.resolve(__dirname, '../');
    const schemasDir = path.join(projectRoot, 'src/schemas'); // Adjust path as needed
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
        this.schemas[url] = schema;
      }
    });
  }

  getSchemaByUrl(url: string): any {
    const check = this.schemas[url];
    return this.schemas[url] || null;
  }
}
