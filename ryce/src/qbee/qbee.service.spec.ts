import { QueryService } from './qbee.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SnowflakeService } from '../snowflake/snowflake.service';

jest.mock('../snowflake/snowflake.service');
jest.mock('fs');
type LogicalOperator = 'AND' | 'OR';
type ComparisonOperator = '=' | '<' | '>' | '<=' | '>=' | 'LIKE'; // Add more comparison operators as needed
type AggregationType = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX'; // Add more aggregation types as needed

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

interface FilterCondition {
  type?: LogicalOperator;
  conditions?: FilterCondition[];
  column?: string;
  operator?: ComparisonOperator;
  value?: string | number | boolean;
  aggregation?: AggregationType;
  aggregated?: boolean;
}

describe('QueryService', () => {
  let service: QueryService;
  const mockSnowflakeService = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        { provide: SnowflakeService, useValue: mockSnowflakeService },
      ],
    }).compile();

    service = module.get<QueryService>(QueryService);
  });

  describe('constructQuery', () => {
    it('should construct and execute a query', async () => {
      const mockPayload: Query = {
        schema: 'transaction details',
        selectedColumns: [
          { columnName: 'Line Price' },
          { columnName: 'Nett. Amount', aggregation: 'SUM' },
          { columnName: 'Quantity' },
          { columnName: 'Registry Code' },
          { columnName: 'Date' },
        ],
        filters: [
          {
            type: 'AND',
            conditions: [
              {
                column: 'Line Price',
                operator: '>',
                value: 100,
              },
              {
                column: 'Quantity',
                operator: '<',
                value: 10,
              },
              {
                type: 'OR',
                conditions: [
                  {
                    column: 'Zone',
                    operator: '=',
                    value: 'MyZone',
                  },
                  {
                    column: 'Quantity',
                    operator: '<',
                    value: 10,
                  },
                ],
              },
            ],
          },
        ],
      };

      const mockSQL =
        'SELECT Line Price, SUM(Nett. Amount), Quantity, Registry Code, Date FROM Fact Sales JOIN Dim Date ON "Dim Date Key" = "Dim Date" WHERE (Line Price > 100 AND Quantity < 10);';
      jest.spyOn(service, 'generateSQL').mockReturnValue(mockSQL);
      mockSnowflakeService.execute.mockResolvedValue('Mocked result');

      const result = await service.constructQuery(mockPayload);
      expect(result).toBe('Mocked result');
    });
  });

  describe('generateSQL', () => {
    it('should generate SQL based on the payload', () => {
      const mockPayload: Query = {
        schema: 'transaction details',
        selectedColumns: [
          { columnName: 'Line Price' },
          { columnName: 'Nett. Amount', aggregation: 'SUM' },
          { columnName: 'Quantity' },
          { columnName: 'Registry Code' },
          { columnName: 'Date' },
        ],
        filters: [
          {
            type: 'AND',
            conditions: [
              {
                column: 'Line Price',
                operator: '>',
                value: 100,
              },
              {
                column: 'Quantity',
                operator: '<',
                value: 10,
              },
              {
                type: 'OR',
                conditions: [
                  {
                    column: 'Zone',
                    operator: '=',
                    value: 'MyZone',
                  },
                  {
                    column: 'Quantity',
                    operator: '<',
                    value: 10,
                  },
                ],
              },
            ],
          },
          {
            column: 'Nett. Amount',
            aggregation: 'SUM',
            aggregated: true,
            operator: '<',
            value: 10,
          },
        ],
      };

      const result = service.generateSQL(mockPayload);
      console.log(result);
      expect(result).toBe(
        `SELECT "Line Price", SUM("Nett. Amount") AS "Nett. Amount", "Quantity", "Registry Code", "Date"
        FROM "Fact Sales" 
        JOIN "Dim Date" ON "Fact Sales"."Dim Date Key" = "Dim Date"."Dim Date Key"
        JOIN "Dim Registry Zone" ON "Fact Sales"."Dim Zone Key" = "Dim Registry Zone"."Dim Zone Key"
        WHERE "Line Price" > 100 AND "Quantity" < 10 AND ("Zone" = 'MyZone' OR "Quantity" < 10)
        GROUP BY "Line Price", "Quantity", "Registry Code", "Date"
        HAVING SUM("Nett. Amount") < 10
        ORDER BY "Line Price", SUM("Nett. Amount"), "Quantity", "Registry Code", "Date";
    `,
      );
    });
  });

  describe('constructWhereClause', () => {
    it('should construct WHERE clause based on conditions', () => {
      const mockConditions: FilterCondition[] = [
        {
          type: 'AND',
          conditions: [
            {
              column: 'Line Price',
              operator: '>',
              value: 100,
            },
            {
              column: 'Quantity',
              operator: '<',
              value: 10,
            },
          ],
        },
      ];

      const result = service.constructWhereClause(mockConditions);
      expect(result).toBe('(Line Price > 100 AND Quantity < 10)');
    });
  });

  describe('generateJoinSQL', () => {
    it('should generate JOIN SQL based on selected columns and schema', () => {
      const mockSelectedColumns = [
        { columnName: 'Line Price' },
        { columnName: 'Date' },
      ];
      const mockSchemaName = 'Fact Sales';

      const result = service.generateJoinSQL(
        mockSelectedColumns,
        [],
        mockSchemaName,
      );
      expect(result).toBe(
        'FROM Fact Sales JOIN Dim Date ON Fact Sales.Dim Date Key = Dim Date.Dim Date Key',
      );
    });
  });

  describe('executeQuery', () => {
    it('should execute the SQL query', async () => {
      const mockSQL = 'SELECT Line Price FROM Fact Sales;';
      const mockSchemaName = 'transaction details';
      mockSnowflakeService.execute.mockResolvedValue('Mocked result');

      const result = await service.executeQuery(mockSQL, mockSchemaName);
      expect(result).toBe('Mocked result');
    });
  });
});
