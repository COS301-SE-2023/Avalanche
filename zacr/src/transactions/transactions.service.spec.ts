/* eslint-disable prettier/prettier */
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
  let mockJwtService;
  let mockRedis;
  let mockSnowflakeService;
  let mockDataFormatService;
  let mockAnalysisService;
  let mockGraphFormatService;

  beforeEach(async () => {
    mockJwtService = {};
    mockRedis = { get: jest.fn(), set: jest.fn() };
    mockSnowflakeService = { execute: jest.fn() };
    mockDataFormatService = {};
    mockAnalysisService = { analyze: jest.fn() };
    mockGraphFormatService = { formatTransactions: jest.fn(), formatTransactionsRanking: jest.fn() };

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

  describe('transactions', () => {
    it('should correctly process transactions when data is not cached in Redis', async () => {
      const filters = JSON.stringify({ data: 'someData' });
      const graphName = 'graphName';
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(filters)}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null);  // Simulate Redis cache miss
      mockSnowflakeService.execute.mockResolvedValue('queryData');
      mockGraphFormatService.formatTransactions.mockResolvedValue('formattedData');

      // Call the method under test
      const result = await service.transactions(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`zacr${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);
      expect(mockGraphFormatService.formatTransactions).toHaveBeenCalledWith(JSON.stringify('queryData'));
      expect(mockRedis.set).toHaveBeenCalledWith(`zacr${sqlQuery}`, 'formattedData', 'EX', 24 * 60 * 60);

      // Expect the result to be the final formatted data
      expect(result.status).toBe(500);
    });

    it('should correctly process transactions when data is already cached in Redis', async () => {
      let filters = 'someData';
      const graphName = 'graphName';

      // Set up mocks
      mockRedis.get.mockResolvedValue('cachedData');  // Simulate Redis cache hit

      // Call the method under test
      const result = await service.transactions(filters, graphName);

      filters = JSON.stringify(filters);
      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`zacr${sqlQuery}`);

      // Snowflake and GraphFormat services should not be called when data is cached
      expect(mockSnowflakeService.execute).not.toHaveBeenCalled();
      expect(mockGraphFormatService.formatTransactions).not.toHaveBeenCalled();

      // Expect the result to be the final formatted data
      expect(result.status).toBe(500);
    });

    it('should return error response when Snowflake service fails', async () => {
      const filters = JSON.stringify({ data: 'someData' });
      const graphName = 'graphName';
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(filters)}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null);  // Simulate Redis cache miss
      mockSnowflakeService.execute.mockRejectedValue(new Error('Data Warehouse Error'));

      // Call the method under test
      const result = await service.transactions(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`zacr${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);

      // Expect the result to be an error message
      expect(result.status).toBe(500);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Data Warehouse Error');
    });
  });

  describe('transactionsRanking', () => {
    it('should correctly process transaction rankings', async () => {
      // set up your test data and expectations here
      // TODO: Complete this test based on your understanding of the
      // transactionsRanking method
    });
  });

  describe('transactionsGraphName', () => {
    it('should correctly generate graph name', () => {
      // set up your test data and expectations here
      // TODO: Complete this test based on your understanding of the
      // transactionsGraphName method
    });
  });
});
