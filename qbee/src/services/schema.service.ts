import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface ComparisonTypes {
  tou?: string;
  filterValues?: (number | string)[];
  aggretate?: boolean;
}

interface ColumnDetail {
  columnName: string;
  columnType: string;
  typeOfFilter: string;
  filterReturnType: string;
  comparisonTypes?: string[];
  filter: boolean | ComparisonTypes[];
  table: string;
}

interface TableDetail {
  table: string;
  from?: string;
  to?: string;
  columns: ColumnDetail[];
}

interface SchemaDetail {
  schema: string;
  fact: string;
  tables: TableDetail[];
}

@Injectable()
export class SchemaService {
  private schemas: SchemaDetail[] = [];

  constructor() {
    const projectRoot = path.resolve(__dirname, '../../');
    console.log(projectRoot);
    const schemasDir = path.join(projectRoot, 'src/schemas'); // Adjust path as needed
    console.log(schemasDir);
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

  validateUserAccess(userPermissions: any, schema: SchemaDetail): boolean {
    for (const tableDetail of schema.tables) {
      for (const columnDetail of tableDetail.columns) {
        if (Array.isArray(columnDetail.filter)) {
          for (const filter of columnDetail.filter) {
            const userPermission = userPermissions.find(
              (perm) => perm.tou === filter.tou
            );

            if (userPermission) {
              // If filter values exist, check if they match with user permission values
              if (filter.filterValues && filter.filterValues.length > 0) {
                const allowedValues = userPermission.values || [];
                if (
                  !filter.filterValues.some((value) => allowedValues.includes(value))
                ) {
                  return false;
                }
              }
            } else {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
}
