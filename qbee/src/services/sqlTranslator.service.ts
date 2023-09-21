import { Injectable } from '@nestjs/common';
import { JoinSchema } from '../interfaces/TableSchema';
import {
  FilterCondition,
  JSONQuery,
  SelectedColumn,
} from '../interfaces/JSONQuery';

@Injectable()
export class SQLTranslatorService {
  constructor() {}

  generateSQL(payload: JSONQuery, schema: any): string {
    let sql = 'SELECT ';

    // Construct SELECT clause
    const orderBy: string[] = [];
    const selectParts: string[] = payload.selectedColumns.map((column) => {
      let part = '"' + column.columnName + '"';
      let orderByPart = '"' + column.columnName + '"';
      if (column.aggregation) {
        part = `${column.aggregation}(${part})`;
        if (!column.renamed) {
          part += ` AS "${column.columnName}"`;
        }
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
      this.generateJoinSQL(payload.selectedColumns, payload.filters, schema);

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
        if (!Array.isArray(condition.value)) {
          return `"${condition.column}" ${condition.operator} ${
            typeof condition.value === 'string'
              ? `'${condition.value}'`
              : condition.value
          }`;
        } else if (
          Array.isArray(condition.value) &&
          condition.value.length > 0
        ) {
          const conArr = [];
          condition.value.forEach((element) => {
            conArr.push(
              `"${condition.column}" ${condition.operator} ${
                typeof element === 'string' ? `'${element}'` : element
              }`,
            );
          });

          return ` ( ${conArr.join(' OR ')}) `;
        }
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
    schema: any,
  ): string {
    // TODOOOOO
    // Read the schema from postgres
    // By the specific name
    // Woohooo
    const baseTableSchema = schema;

    const joinStatements: string[] = [];

    // Helper function to check if a column is in a join schema
    const columnInJoinSchema = (
      columnName: string,
      joinSchema: JoinSchema,
    ): boolean => {
      return (
        joinSchema.columns?.some(
          (element) => element.columnName === columnName,
        ) ?? false
      );
    };

    // Check selected columns
    selectedColumns.forEach((selectedColumn) => {
      let columnFound = false; // Flag to indicate if the column is found and joined

      for (const joinSchema of baseTableSchema.tables || []) {
        if (columnFound) break; // Skip to the next selectedColumn if this one is already found and joined

        const tableJoinedTo = columnInJoinSchema(
          selectedColumn.columnName,
          joinSchema,
        );

        if (tableJoinedTo && joinSchema.table != baseTableSchema.fact) {
          const joinStatement = `JOIN "${joinSchema.table}" ON "${baseTableSchema.fact}"."${joinSchema.from}" = "${joinSchema.table}"."${joinSchema.to}"`;

          if (!joinStatements.includes(joinStatement)) {
            joinStatements.push(joinStatement);
          }

          columnFound = true; // Set the flag to true as the column is found and joined
        } else if (tableJoinedTo && joinSchema.table == baseTableSchema.fact) {
          columnFound = true; // Set  the flag to true as the column is found but not joined
        }
      }
    });

    // Check filter columns
    const checkFilterColumns = (filterConditions: FilterCondition[]) => {
      filterConditions.forEach((condition) => {
        let columnFound = false; // Flag to indicate if the column is found and joined
        if (!condition.column) {
          columnFound = true;
        }
        for (const joinSchema of baseTableSchema.tables || []) {
          if (columnFound) break; // Skip to the next selectedColumn if this one is already found and joined

          const tableJoinedTo = columnInJoinSchema(
            condition.column,
            joinSchema,
          );

          if (tableJoinedTo && joinSchema.table != baseTableSchema.fact) {
            const joinStatement = `JOIN "${joinSchema.table}" ON "${baseTableSchema.fact}"."${joinSchema.from}" = "${joinSchema.table}"."${joinSchema.to}"`;

            if (!joinStatements.includes(joinStatement)) {
              joinStatements.push(joinStatement);
            }

            columnFound = true; // Set the flag to true as the column is found and joined
          } else if (
            tableJoinedTo &&
            joinSchema.table == baseTableSchema.fact
          ) {
            columnFound = true; // Set the flag to true as the column is found but not joined
          }
        }
        // Recursively check nested conditions
        if (condition.conditions) {
          checkFilterColumns(condition.conditions);
        }
      });
    };

    checkFilterColumns(filters);

    return `FROM ${baseTableSchema.schema} ${joinStatements.join(' ')}`;
  }
}
