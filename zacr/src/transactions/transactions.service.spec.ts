import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transactions.service';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { DataFormatService } from '../data-format/data-format.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockJwtService = {
    /* mock methods if needed */
  };
  const mockRedis = {
    /* mock methods if needed */
  };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockDataFormatService = {
    /* mock methods if needed */
  };
  const mockAnalysisService = { analyze: jest.fn() };
  const mockGraphFormatService = { format: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: DataFormatService, useValue: mockDataFormatService },
        { provide: AnalysisService, useValue: mockAnalysisService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should correctly process transactions', async () => {
    const jsonInput = '{"data": "someData"}';

    // Set up the mocks to return specific values
    mockSnowflakeService.execute.mockResolvedValue('queryData');
    mockAnalysisService.analyze.mockResolvedValue('analyzedData');
    mockGraphFormatService.format.mockResolvedValue('formattedData');

    // Call the method under test
    const result = await service.transactions(jsonInput);

    // Expect the mocks to have been called with the correct arguments
    expect(mockSnowflakeService.execute).toHaveBeenCalledWith(
      `call transactionsByRegistrar('{"data": "someData"}')`,
    );
    expect(mockAnalysisService.analyze).toHaveBeenCalledWith('queryData');
    expect(mockGraphFormatService.format).toHaveBeenCalledWith('"queryData"');

    // Expect the result to be the final formatted data
    expect(result).toBe('formattedData');
  });
});
