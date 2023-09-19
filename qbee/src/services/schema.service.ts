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

  public initializeSchemas() {
    const projectRoot = path.resolve(__dirname, '../');
    const schemasFilePath = path.join(projectRoot, 'src/schemas'); // Adjust path as needed
    this.loadSchemas(schemasFilePath);
  }

  protected loadSchemas(dir: string) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && path.extname(file) === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsedSchemas: SchemaDetail[] = JSON.parse(fileContent);
        this.schemas.push(...parsedSchemas); // Merge new schemas into existing array
      }
    });
  }

  getSchemaByFact(fact: string): SchemaDetail | null {
    return this.schemas.find((schema) => schema.fact === fact) || null;
  }

  validateUserAccess(userPermissions: any[], schema: SchemaDetail): boolean {
    for (const tableDetail of schema.tables) {
      for (const columnDetail of tableDetail.columns) {
        if (Array.isArray(columnDetail.filter)) {
          for (const filter of columnDetail.filter) {
            const userPermission = userPermissions.find(
              (perm) => perm.tou === filter.tou && perm.dataSource === schema.fact,
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
