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
    mockGraphFormatService = {
      formatTransactions: jest.fn(),
      formatTransactionsRanking: jest.fn(),
    };

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
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(
        filters,
      )}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockResolvedValue([
        { TRANSACTIONSBYREGISTRAR: { data: 'data', filters: 'filters' } },
      ]);
      mockGraphFormatService.formatTransactions.mockResolvedValue(
        'formattedData',
      );

      // Call the method under test
      const result = await service.transactions(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`africa${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);
      expect(mockRedis.set).toHaveBeenCalledWith(
        `africa${sqlQuery}`,
        expect.any(String),
        'EX',
        24 * 60 * 60,
      );

      // Expect the result to be the final formatted data
      expect(result.status).toBe('success');
    });

    it('should correctly process transactions when data is already cached in Redis', async () => {
      let filters = 'someData';
      const graphName = 'graphName';

      // Set up mocks
      mockRedis.get.mockResolvedValue(
        JSON.stringify({
          data: { chartData: {}, jsonData: {} },
          filters: 'filters',
        }),
      ); // Simulate Redis cache hit

      // Call the method under test
      const result = await service.transactions(filters, graphName);

      filters = JSON.stringify(filters);
      const sqlQuery = `call transactionsByRegistrar('${filters}')`;

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`africa${sqlQuery}`);

      // Snowflake and GraphFormat services should not be called when data is cached
      expect(mockSnowflakeService.execute).not.toHaveBeenCalled();
      expect(mockGraphFormatService.formatTransactions).not.toHaveBeenCalled();

      // Expect the result to be the final formatted data
      expect(result.status).toBe('success');
    });

    it('should return error response when Snowflake service fails', async () => {
      const filters = JSON.stringify({ data: 'someData' });
      const graphName = 'graphName';
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(
        filters,
      )}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Data Warehouse Error'),
      );

      // Call the method under test
      const result = await service.transactions(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`africa${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);

      // Expect the result to be an error message
      expect(result.status).toBe(500);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Data Warehouse Error');
    });
  });

  describe('transactionsRanking', () => {
    it('should correctly process transaction rankings when data is not cached in Redis', async () => {
      const filters = { data: 'someData', isRanking: true };
      const graphName = 'graphName';
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(
        filters,
      )}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockResolvedValue([
        { TRANSACTIONSBYREGISTRAR: { data: 'data', filters: 'filters' } },
      ]);

      // Call the method under test
      const result = await service.transactionsRanking(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`africa${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);
      expect(mockRedis.set).toHaveBeenCalledWith(
        `africa${sqlQuery}`,
        expect.any(String),
        'EX',
        24 * 60 * 60,
      );

      // Expect the result to be the final formatted data
      expect(result.status).toBe('success');
    });

    it('should correctly process transaction rankings when data is already cached in Redis', async () => {
      const filters = { data: 'someData', isRanking: true };
      const graphName = 'graphName';
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(
        filters,
      )}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(
        JSON.stringify({
          data: { chartData: {}, jsonData: {} },
          filters: 'filters',
        }),
      ); // Simulate Redis cache hit

      // Call the method under test
      const result = await service.transactionsRanking(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`africa${sqlQuery}`);

      // Snowflake and GraphFormat services should not be called when data is cached
      expect(mockSnowflakeService.execute).not.toHaveBeenCalled();
      expect(
        mockGraphFormatService.formatTransactionsRanking,
      ).not.toHaveBeenCalled();

      // Expect the result to be the final formatted data
      expect(result.status).toBe('success');
    });

    it('should return error response when Snowflake service fails', async () => {
      const filters = { data: 'someData', isRanking: true };
      const graphName = 'graphName';
      const sqlQuery = `call transactionsByRegistrar('${JSON.stringify(
        filters,
      )}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Data Warehouse Error'),
      );

      // Call the method under test
      const result = await service.transactionsRanking(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`africa${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);

      // Expect the result to be an error message
      expect(result.status).toBe(500);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Data Warehouse Error');
    });
  });

  describe('transactionsGraphName', () => {
    it('should correctly generate graph name when filters are not defined', () => {
      const filters = {};
      const perReg = true;
      const result = service.transactionsGraphName(filters, perReg);
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getUTCFullYear() - 1);
      const expectedDate = currentDate.getFullYear() + '-01-01';
      const expectedToDate = currentDate.getFullYear();
      const expected = `Monthly Transactions per registrar from NaN undefined NaN to NaN undefined NaN (all zones)`;

      expect(result).toBe(expected);
    });

    it('should correctly generate graph name when filters are defined', () => {
      const filters = {
        dateFrom: '2022-07-27',
        dateTo: '2023-07-27',
        granularity: 'year',
        zone: ['zoneA'],
      };
      const perReg = false;
      const result = service.transactionsGraphName(filters, perReg);
      const expected = `Yearly Transactions from 27 Jul 2022 to 27 Jul 2023 (zoneA)`;

      expect(result).toBe(expected);
    });

    it('should correctly generate graph name when dateTo filter is not defined', () => {
      const filters = {
        dateFrom: '2022-07-27',
        granularity: 'week',
        zone: ['zoneB'],
      };
      const perReg = true;
      const result = service.transactionsGraphName(filters, perReg);
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getUTCFullYear() - 1);
      const expected = `Weekly Transactions per registrar from 27 Jul 2022 to NaN undefined NaN (zoneB)`;

      expect(result).toBe(expected);
    });

    it('should correctly generate graph name when granularity filter is day defined', () => {
      const filters = {
        dateFrom: '2022-07-27',
        granularity: 'day',
        zone: ['zoneB'],
      };
      const perReg = true;
      const result = service.transactionsGraphName(filters, perReg);
      const expected = `Daily Transactions per registrar from 27 Jul 2022 to NaN undefined NaN (zoneB)`;

      expect(result).toBe(expected);
    });
  });
});
