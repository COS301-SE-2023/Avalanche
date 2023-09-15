import { Injectable, BadRequestException } from '@nestjs/common';
import { SnowflakeService } from '../snowflake/snowflake.service';

interface Query {
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

@Injectable()
export class QueryService {
    constructor(private readonly snowflakeService: SnowflakeService) { }

    async constructQuery(queryPayload: Query): Promise<any> {
        // 3. Generate SQL from the payload
        const sql = this.generateSQL(queryPayload);

        // 4. Execute the SQL and fetch results
        const results = await this.executeQuery(sql);

        return results;
    }

    generateSQL(payload: Query): string {
        let sql = 'SELECT ';

        // Construct SELECT clause
        const selectParts: string[] = payload.selectedColumns.map((column) => {
            let part = column.columnName;
            if (column.aggregation) {
                part = `${column.aggregation}(${part})`;
            }
            if (column.renamed) {
                part += ` AS "${column.renamed}"`;
            }
            return part;
        });
        sql += selectParts.join(', ');

        // Construct FROM clause (assuming a single table for simplicity)

        // You might need to adjust this if you have multiple tables or need to determine the table dynamically
        sql += ' FROM TableName'; // Replace 'TableName' with the actual table name or logic to determine it

        // Construct WHERE clause
        if (payload.filters && payload.filters.length > 0) {
            const whereClause = this.constructWhereClause(payload.filters);
            if (whereClause) {
                sql += ' WHERE ' + whereClause;
            }
        }

        // Construct GROUP BY clause
        const groupByColumns = payload.selectedColumns
            .filter((column) => !column.aggregation)
            .map((column) => column.columnName);
        if (groupByColumns.length > 0) {
            sql += ' GROUP BY ' + groupByColumns.join(', ');
        }

        // Construct HAVING clause
        const havingConditions = payload.filters?.filter(
            (condition) => condition.aggregated,
        );
        if (havingConditions && havingConditions.length > 0) {
            const havingClause = this.constructWhereClause(havingConditions); // Reuse the same function for HAVING
            if (havingClause) {
                sql += ' HAVING ' + havingClause;
            }
        }

        return sql + ';';
    }


function generateJoinSQL(selectedColumns: SelectedColumn[], schema: ColumnSchema[]): string {
    let baseTable: string | null = null;
    const joinStatements: string[] = [];

    selectedColumns.forEach(selectedColumn => {
        const matchingSchema = schema.find(s => s.columnName === selectedColumn.columnName);
        if (matchingSchema) {
            if (!baseTable) {
                baseTable = matchingSchema.table;
            } else if (matchingSchema.joinFromTable && matchingSchema.joinFrom && matchingSchema.joinTo) {
                const joinStatement = `JOIN ${matchingSchema.table} ON ${matchingSchema.joinFromTable}.${matchingSchema.joinFrom} = ${matchingSchema.table}.${matchingSchema.joinTo}`;
                if (!joinStatements.includes(joinStatement)) {
                    joinStatements.push(joinStatement);
                }
            }
        }
    });

    return `FROM ${baseTable} ${joinStatements.join(' ')}`;
}

constructWhereClause(conditions: FilterCondition[]): string {
    const parts: string[] = conditions.map((condition) => {
        if (condition.type && condition.conditions) {
            // Logical operator (AND/OR) with nested conditions
            return `(${this.constructWhereClause(condition.conditions)})`;
        } else if (
            condition.column &&
            condition.operator &&
            condition.value !== undefined
        ) {
            // Simple condition
            return `${condition.column} ${condition.operator} ${typeof condition.value === 'string'
                    ? `'${condition.value}'`
                    : condition.value
                }`;
        }
        return '';
    });

    // Join the parts with the appropriate logical operator
    return parts
        .filter((part) => part)
        .join(` ${conditions[0].type || 'AND'} `);
}

  async executeQuery(sql: string): Promise < any > {
    // Execute the SQL and return the results
}
}
