import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transactions.service';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import Redis from 'ioredis';

jest.mock('../snowflake/snowflake.service');

describe('TransactionService Integration Test (3 column)', () => {
  let transactionService: TransactionService;
  let module: TestingModule;

  beforeAll(async () => {
    const mockSnowflakeService = {
      execute: jest.fn().mockImplementation((query) => {
        return Promise.resolve(
          JSON.parse(
            `[{"TRANSACTIONSBYREGISTRAR" : [{"date":"someDate", "Code":"someCode", "Count":5}]}]`,
          ),
        );
      }),
    };
    const mockJwtService = {
      /* mock methods if needed */
    };
    const mockRedis = {
      /* mock methods if needed */
    };

    module = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        AnalysisService,
        GraphFormatService,
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should return successful transaction data', async () => {
    const jsonInput = {
      dateFrom: '2023-06-01',
      dateTo: '2023-06-23',
      granularity: 'day',
    };
    const graphName = 'testGraph';

    const result = await transactionService.transactions(
      JSON.stringify(jsonInput),
      graphName,
    );

    expect(result.status).toBe('success');
    expect(result.data.graphName).toBe(graphName);
    expect(result.data.labels).toHaveLength(1);
    expect(result.data.labels[0]).toBe('someCode');
    expect(result.data.datasets).toHaveLength(1);
    expect(result.data.datasets[0].label).toBe('someDate');
    expect(result.data.datasets[0].data).toHaveLength(1);
    expect(result.data.datasets[0].data[0]).toBe(5);
  });

  afterAll(async () => {
    await module.close(); // Ensure you close the module after tests to cleanup
  });
});
