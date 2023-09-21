import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface ComparisonTypes {
  tou?: string;
  filterValues?: (number | string)[];
  filter?: boolean;
}

interface AggregateTypes {
  tou?: string;
  aggregate?: boolean;
}

interface ColumnDetail {
  columnName: string;
  columnType: string;
  typeOfFilter: string;
  filterReturnType: string;
  comparisonTypes?: string[];
  filter: ComparisonTypes[];
  aggregation: AggregateTypes[];
  view: string[];
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
    //const check = this.schemas[url];
    return this.schemas[url] || null;
  }

  validateUserAccess(tou: string, query: any, schema: SchemaDetail): boolean {
    // Check if user has access to selected columns and can apply filters and aggregation
    for (const selectedColumn of query.selectedColumns) {
      const schemaColumn = schema.tables
        .find((table) =>
          table.columns.some(
            (col) => col.columnName === selectedColumn.columnName,
          ),
        )
        ?.columns.find((col) => col.columnName === selectedColumn.columnName);

      if (!schemaColumn) {
        return false; // Column not found in schema
      }

      // Check if user has access to view this column
      if (!schemaColumn.view.includes(tou)) {
        return false; // User is not allowed to view this column
      }

      // Check if user is allowed to aggregate this column if an aggregation is specified
      if (selectedColumn.aggregation) {
        const aggregationPermission = schemaColumn.aggregation.find(
          (agg) => agg.tou === tou && agg.aggregate === true,
        );
        if (!aggregationPermission) {
          return false; // User is not allowed to aggregate this column
        }
      }
    }

    // Check if user can apply the filters
    if (!this.checkFilterPermissions(tou, query, schema)) return false;

    return true; // User has access to everything specified in the query
  }

  checkFilterPermissions(tou, query, schema) {
    function checkFilterGroup(filterGroup) {
      for (const condition of filterGroup.conditions) {
        // Check if the condition is itself a nested filter group
        if (condition.type && condition.conditions) {
          if (!checkFilterGroup(condition)) {
            return false;
          }
          continue;
        }

        const schemaColumn = schema.tables
          .find((table) =>
            table.columns.some((col) => col.columnName === condition.column),
          )
          ?.columns.find((col) => col.columnName === condition.column);

        if (!schemaColumn) {
          return false; // Column not found in schema
        }

        // Check if user is allowed to filter this column
        const filterPermission = schemaColumn.filter.find(
          (filt) => filt.tou === tou && filt.filter === true,
        );
        if (!filterPermission) {
          return false; // User is not allowed to filter this column
        }

        const filterValues = schemaColumn.filter.find(
          (filt) => filt.filterValues,
        );
        if (filterValues) {
          let check = false;

          // If condition.value is a string
          if (typeof condition.value === 'string') {
            for (const filters of filterValues.filterValues) {
              if (filters === condition.value) {
                check = true;
                break; // Exit the loop once a match is found
              }
            }
          }
          // If condition.value is an array
          else if (Array.isArray(condition.value)) {
            check = condition.value.every((val) =>
              filterValues.filterValues.includes(val),
            );
          }

          if (check === false) {
            return false;
          }
        }

        // Check if the operator is allowed for this column
        if (!schemaColumn.comparisonTypes.includes(condition.operator)) {
          return false; // Operator is not allowed for this column
        }
      }
      return true;
    }

    for (const filterGroup of query.filters) {
      if (!checkFilterGroup(filterGroup)) {
        return false;
      }
    }
    return true;
  }

  transformSchemaForUser(tou: string, schema: SchemaDetail): any[] {
    const transformedColumns = [];

    for (const tableDetail of schema.tables) {
      for (const columnDetail of tableDetail.columns) {
        // Initialize an object to hold the transformed column details
        const transformedColumn: any = {
          columnName: columnDetail.columnName,
          columnType: columnDetail.columnType,
          typeOfFilter: columnDetail.typeOfFilter,
          filterReturnType: columnDetail.filterReturnType,
          comparisonTypes: columnDetail.comparisonTypes,
          table: columnDetail.table,
        };

        // Check if user is allowed to view this column
        if (columnDetail.view.includes(tou)) {
          transformedColumn.view = true;
          // Check if user is allowed to filter this column
          const filterPermission = columnDetail.filter.find(
            (filter) => filter.tou === tou && filter.filter === true,
          );
          if (filterPermission) {
            transformedColumn.filter = filterPermission.filter;

            // Add filter values if they exist for this user
            if (filterPermission.filterValues) {
              transformedColumn.filterValue = filterPermission.filterValues;
            }
          } else {
            transformedColumn.filter = false;
          }

          // Add this transformed column to the array
          transformedColumns.push(transformedColumn);
        } else {
          transformedColumn.view = true;
          const filterPermission = columnDetail.filter.find(
            (filter) => filter.tou === tou && filter.filter === true,
          );
          if (filterPermission) {
            transformedColumn.filter = filterPermission.filter;

            // Add filter values if they exist for this user
            if (filterPermission.filterValues) {
              transformedColumn.filterValue = filterPermission.filterValues;
            }
            transformedColumns.push(transformedColumn);
          }
        }
      }
    }

    return transformedColumns;
  }
}
