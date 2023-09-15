import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SnowflakeService } from '../snowflake/snowflake.service';

interface Query {
  schema: string;
  selectedColumns: SelectedColumn[];
  filters: FilterCondition[];
}

interface SelectedColumn {
  columnName: string;
  aggregation?: AggregationType;
  renamed?: string;
}

type AggregationType = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX'; // Add more aggregation types as needed

interface FilterCondition {
  type?: LogicalOperator;
  conditions?: FilterCondition[];
  column?: string;
  operator?: ComparisonOperator;
  value?: string | number | boolean;
  aggregation?: AggregationType;
  aggregated?: boolean;
}

type LogicalOperator = 'AND' | 'OR';
type ComparisonOperator = '=' | '<' | '>' | '<=' | '>=' | 'LIKE'; // Add more comparison operators as needed

interface TableSchema {
  schema: string;
  table: string;
  columns: string[];
  joins?: JoinSchema[];
}

interface JoinSchema {
  table: string;
  from: string;
  to: string;
  columns: string[];
}

@Injectable()
export class QueryService {
  constructor(private readonly snowflakeService: SnowflakeService) {}

  async constructQuery(queryPayload: Query): Promise<any> {
    // 3. Generate SQL from the payload
    const sql = this.generateSQL(queryPayload);

    // 4. Execute the SQL and fetch results
    const results = await this.executeQuery(sql, queryPayload.schema);

    return results;
  }

  generateSQL(payload: Query): string {
    let sql = 'SELECT ';

    // Construct SELECT clause
    let aggregated = false;
    const orderBy: string[] = [];
    const selectParts: string[] = payload.selectedColumns.map((column) => {
      let part = '"' + column.columnName + '"';
      let orderByPart = '"' + column.columnName + '"';
      if (column.aggregation) {
        part = `${column.aggregation}(${part})`;
        if (!column.renamed) {
          part += ` AS "${column.columnName}"`;
        }
        aggregated = true;
      }
      if (column.renamed) {
        part += ` AS "${column.renamed}"`;
        orderByPart = column.renamed;
      }
      orderBy.push(orderByPart);
      return part;
    });
    sql += selectParts.join(', ');

    // Construct FROM clause (assuming a single table for simplicity)
    sql +=
      '\n' +
      this.generateJoinSQL(
        payload.selectedColumns,
        payload.filters,
        payload.schema,
      );

    // Construct WHERE clause
    if (payload.filters && payload.filters.length > 0) {
      const whereClause = this.constructWhereClause(payload.filters);
      if (whereClause) {
        sql += '\nWHERE ' + whereClause;
      }
    }

    // Construct GROUP BY clause
    const groupByColumns = payload.selectedColumns
      .filter((column) => !column.aggregation)
      .map((column) => '"' + column.columnName + '"');
    if (groupByColumns.length > 0) {
      sql += '\nGROUP BY ' + groupByColumns.join(', ');
    }

    // Construct HAVING clause
    const havingConditions = payload.filters?.filter(
      (condition) => condition.aggregated,
    );
    if (havingConditions && havingConditions.length > 0) {
      const havingClause = this.constructHavingClause(havingConditions); // Reuse the same function for HAVING
      if (havingClause) {
        sql += '\nHAVING ' + havingClause;
      }
    }

    // Construct ORDER by
    sql += '\nORDER BY ' + orderBy.join(', ');

    return sql + ';';
  }

  constructWhereClause(
    conditions: FilterCondition[],
    operator: any = 'AND',
  ): string {
    const parts: string[] = conditions.map((condition) => {
      if (condition.type && condition.conditions) {
        // Logical operator (AND/OR) with nested conditions
        return `(${this.constructWhereClause(
          condition.conditions,
          condition.type,
        )})`;
      } else if (
        condition.column &&
        condition.operator &&
        condition.value !== undefined
      ) {
        // Simple condition
        return `"${condition.column}" ${condition.operator} ${
          typeof condition.value === 'string'
            ? `'${condition.value}'`
            : condition.value
        }`;
      }
      return '';
    });

    // Join the parts with the appropriate logical operator
    return parts.filter((part) => part).join(` ${operator || 'AND'} `);
  }

  constructHavingClause(
    conditions: FilterCondition[],
    operator: any = 'AND',
  ): string {
    const parts: string[] = conditions.map((condition) => {
      if (condition.type && condition.conditions) {
        // Logical operator (AND/OR) with nested conditions
        return `(${this.constructWhereClause(
          condition.conditions,
          condition.type,
        )})`;
      } else if (
        condition.column &&
        condition.operator &&
        condition.value !== undefined
      ) {
        // Simple condition
        return `${condition.aggregation}("${condition.column}") ${
          condition.operator
        } ${
          typeof condition.value === 'string'
            ? `'${condition.value}'`
            : condition.value
        }`;
      }
      return '';
    });

    // Join the parts with the appropriate logical operator
    return parts.filter((part) => part).join(` ${operator || 'AND'} `);
  }

  generateJoinSQL(
    selectedColumns: SelectedColumn[],
    filters: FilterCondition[] = [],
    schemaName: string,
  ): string {
    const projectRoot = path.resolve(__dirname, '../');
    const schemaFilePath = path.join(projectRoot, 'qbee/schema.json'); // Adjust the path if needed
    const schemaContent = JSON.stringify([
      {
        schema: 'transaction details',
        table: 'Fact Sales',
        columns: ['Line Price', 'Nett. Amount', 'Quantity', 'Registry Code'],
        joins: [
          {
            table: 'Dim Date',
            from: 'Dim Date Key',
            to: 'Dim Date Key',
            columns: [
              'Date',
              'Day Of Week',
              'Day Name',
              'Is Weekday?',
              'Month',
              'Month Year',
              'Month Name',
              'Year Name',
            ],
          },
          {
            table: 'Dim Registry Product',
            from: 'Dim Product Key',
            to: 'Dim Product Key',
            columns: ['Code'],
          },
          {
            table: 'Dim Registry Domain',
            from: 'Dim Domain Key',
            to: 'Dim Domain Key',
            columns: [
              'Created Date',
              'Expiry Date',
              'Exists In Registry?',
              'Status',
            ],
          },
          {
            table: 'Dim Registry Registrar',
            from: 'Dim Registrar Key',
            to: 'Dim Registrar Key',
            columns: ['Code', 'Name', 'Company Name', 'Trading Name'],
          },
          {
            table: 'Dim Sales Detail',
            from: 'Dim Sales Detail Key',
            to: 'Dim Sales Detail Key',
            columns: ['System', 'Type', 'Source'],
          },
          {
            table: 'Dim Registry Zone',
            from: 'Dim Zone Key',
            to: 'Dim Zone Key',
            columns: ['Zone', 'Name', 'Operator'],
          },
        ],
      },
    ]);
    const schema: TableSchema[] = JSON.parse(schemaContent);
    const baseTableSchema = schema.find((s) => s.schema === schemaName);
    if (!baseTableSchema) {
      throw new Error('No schema found');
    }

    const joinStatements: string[] = [];

    // Helper function to check if a column is in a join schema
    const columnInJoinSchema = (
      columnName: string,
      joinSchema: JoinSchema,
    ): boolean => {
      return joinSchema.columns.includes(columnName);
    };

    // Check selected columns
    selectedColumns.forEach((selectedColumn) => {
      if (!baseTableSchema.columns.includes(selectedColumn.columnName)) {
        baseTableSchema.joins?.forEach((joinSchema) => {
          if (columnInJoinSchema(selectedColumn.columnName, joinSchema)) {
            const joinStatement = `JOIN "${joinSchema.table}" ON "${baseTableSchema.table}"."${joinSchema.from}" = "${joinSchema.table}"."${joinSchema.to}"`;
            if (!joinStatements.includes(joinStatement)) {
              joinStatements.push(joinStatement);
            }
          }
        });
      }
    });

    // Check filter columns
    const checkFilterColumns = (filterConditions: FilterCondition[]) => {
      filterConditions.forEach((condition) => {
        if (
          condition.column &&
          !baseTableSchema.columns.includes(condition.column)
        ) {
          baseTableSchema.joins?.forEach((joinSchema) => {
            if (columnInJoinSchema(condition.column, joinSchema)) {
              const joinStatement = `JOIN "${joinSchema.table}" ON "${baseTableSchema.table}"."${joinSchema.from}" = "${joinSchema.table}"."${joinSchema.to}"`;
              if (!joinStatements.includes(joinStatement)) {
                joinStatements.push(joinStatement);
              }
            }
          });
        }
        // Recursively check nested conditions
        if (condition.conditions) {
          checkFilterColumns(condition.conditions);
        }
      });
    };

    checkFilterColumns(filters);

    return `FROM ${baseTableSchema.table} ${joinStatements.join(' ')}`;
  }

  async executeQuery(sqlQuery: string, schemaName: string): Promise<any> {
    try {
      return await this.snowflakeService.execute(sqlQuery);
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        error: true,
        message:
          'Data Warehouse Error while trying to execute QBee statement for - ' +
          schemaName,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
