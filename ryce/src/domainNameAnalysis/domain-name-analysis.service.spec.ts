import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, of } from 'rxjs';
import Redis from 'ioredis';
import { DomainNameAnalysisService } from './domain-name-analysis.service';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

jest.mock('@nestjs/axios');

describe('DomainNameAnalysisService', () => {
  let service: DomainNameAnalysisService;
  const mockHttpService = { post: jest.fn() };
  const mockRedis = { get: jest.fn(), set: jest.fn() };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockGraphFormatService = {
    formatDomainLengthAnalysis: jest.fn(),
    formatDomainNameAnalysis: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainNameAnalysisService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
      ],
    }).compile();

    service = module.get<DomainNameAnalysisService>(DomainNameAnalysisService);
  });

  describe('sendData', () => {
    it('should return formatted data from Redis if it exists', async () => {
      const mockData = JSON.stringify({ test: 'data' });
      const filters = { num: 10, granularity: 'month' };
      const mockQuery = `call domainNameAnalysis('${JSON.stringify(filters)}')`;

      mockRedis.get.mockResolvedValue(mockData);
      mockGraphFormatService.formatDomainNameAnalysis.mockResolvedValue(
        mockData,
      );

      const result = await service.sendData({ filters });

      expect(mockRedis.get).toHaveBeenCalledWith(`ryce` + mockQuery);
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName:
            'Most common sub words in newly created domains in the last 10 month(s)',
          test: 'data',
          warehouse: 'ryce',
          graphType: 'domainNameAnalysis/count',
        },
        timestamp: expect.any(String),
      });
    });

    it('should execute SnowflakeService and set data in Redis if no data in Redis', async () => {
      const mockData = { DOMAINNAMEANALYSIS: 'test' };
      const filters = { num: 10, granularity: 'month' };
      const mockQuery = `call domainNameAnalysis('${JSON.stringify(filters)}')`;

      mockRedis.get.mockResolvedValue(null);
      mockSnowflakeService.execute.mockResolvedValue([mockData]);
      mockGraphFormatService.formatDomainNameAnalysis.mockResolvedValue(
        JSON.stringify({ formattedData: 'formattedData' }),
      );
      mockHttpService.post.mockReturnValue(of({ data: 'responseData' }));

      const result = await service.sendData({ filters });

      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(mockQuery);
      expect(mockHttpService.post).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalledWith(
        `ryce` + mockQuery,
        JSON.stringify({ formattedData: 'formattedData' }),
        'EX',
        72 * 60 * 60,
      );
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName:
            'Most common sub words in newly created domains in the last 10 month(s)',
          formattedData: 'formattedData',

          warehouse: 'ryce',
          graphType: 'domainNameAnalysis/count',
        },
        timestamp: expect.any(String),
      });
    });

    it('should return error if SnowflakeService throws an error', async () => {
      const filters = { num: 10, granularity: 'month' };

      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Data Warehouse Error'),
      );

      const result = await service.sendData({ filters });

      expect(result).toEqual({
        status: 500,
        error: true,
        message: 'Data Warehouse Error',
        timestamp: expect.any(String),
      });
    });

    it('should return error if format throws an error', async () => {
      const filters = { num: 10, granularity: 'month' };

      mockRedis.get.mockResolvedValue(null);

      mockGraphFormatService.formatDomainNameAnalysis.mockRejectedValue(
        new Error('Format Error'),
      );

      const mockData = { DOMAINNAMEANALYSIS: 'test' };
      mockSnowflakeService.execute.mockResolvedValue([mockData]);

      mockHttpService.post.mockReturnValue(of({ data: 'responseData' }));

      const result = await service.sendData({ filters });

      expect(result).toEqual({
        status: 500,
        error: true,
        message: 'Format Error',
        timestamp: expect.any(String),
      });
    });

    // it('should return error if httpService throws an error', async () => {
    //   const filters = { num: 10, granularity: 'month' };

    //   mockSnowflakeService.execute.mockReturnValue([
    //     { DOMAINNAMEANALYSIS: 'data' },
    //   ]);
    //   mockHttpService.post.mockReturnValue(new Error('HTTP Error'));

    //   const result = await service.sendData({ filters });

    //   expect(result).toEqual({
    //     status: 500,
    //     error: true,
    //     message: 'HTTP Error',
    //     timestamp: expect.any(String),
    //   });
    // });
  });

  describe('domain length', () => {
    it('should return formatted data from domainLength', async () => {
      const mockData = JSON.stringify({ test: 'data' });
      const filters = JSON.stringify({ registrar: [], zone: [] });

      mockRedis.get.mockResolvedValue(mockData);
      mockGraphFormatService.formatDomainLengthAnalysis.mockResolvedValue(
        mockData,
      );

      const result = await service.domainLength(filters, '');

      expect(result).toEqual({
        status: 'success',
        data: {
          graphName: expect.any(String),
          test: 'data',
          warehouse: 'ryce',
          graphType: 'domainNameAnalysis/length',
        },
        timestamp: expect.any(String),
      });
    });

    it('should return error if domainLength catches an error', async () => {
      const filters = JSON.stringify({ registrar: [], zone: [] });

      mockRedis.get.mockReturnValue(null);

      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Data Warehouse Error'),
      );

      const result = await service.domainLength(filters, '');

      expect(result).toEqual({
        status: 500,
        error: true,
        message: 'Data Warehouse Error',
        timestamp: expect.any(String),
      });
    });

    it('should return error if Redis get method throws an error', async () => {
      const filters = JSON.stringify({ registrar: [], zone: [] });

      mockRedis.get.mockImplementation(() => {
        throw new Error('Redis Error');
      });

      const result = await service.domainLength(filters, '');

      expect(result).toEqual({
        status: 500,
        error: true,
        message: 'Redis Error',
        timestamp: expect.any(String),
      });
    });

    it('should return error if Redis set method throws an error', async () => {
      const filters = JSON.stringify({ registrar: [], zone: [] });

      mockRedis.get.mockResolvedValue(null);
      mockSnowflakeService.execute.mockResolvedValue('results');
      mockRedis.set.mockImplementation(() => {
        throw new Error('Redis Error');
      });

      const result = await service.domainLength(filters, '');

      expect(result).toEqual({
        status: 500,
        error: true,
        message: 'Redis Error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('domainLengthGraphName function', () => {
    it('should generate graph name with all properties', () => {
      const filters = {
        registrar: ['test1', 'test2'],
        zone: ['zone1', 'zone2'],
        dateFrom: '2022-01-01',
        dateTo: '2022-12-31',
      };

      const graphName = service.domainLengthGraphName(filters);
      expect(graphName).toBe(
        'Length of newly created domains from 01 January 2022 to 31 December 2022 for test1, test2 for zone1, zone2',
      );
    });

    it('should generate graph name with no properties', () => {
      const filters = {};
      const date = new Date();
      const year = date.getUTCFullYear() - 1;

      const graphName = service.domainLengthGraphName(filters);
      expect(graphName).toBe(
        `Length of newly created domains from 01 January ${year} to 31 December ${year} across all registrars for all zones`,
      );
    });

    it('should generate graph name with some properties', () => {
      const filters = { registrar: ['test1'] };
      const date = new Date();
      const year = date.getUTCFullYear() - 1;

      const graphName = service.domainLengthGraphName(filters);
      expect(graphName).toBe(
        `Length of newly created domains from 01 January ${year} to 31 December ${year} for test1 for all zones`,
      );
    });

    it('should generate graph name with multiple registrars and zones', () => {
      const filters = {
        registrar: ['test1', 'test2', 'test3'],
        zone: ['zone1', 'zone2', 'zone3'],
        dateFrom: '2022-01-01',
        dateTo: '2022-12-10',
      };

      const graphName = service.domainLengthGraphName(filters);
      expect(graphName).toBe(
        `Length of newly created domains from 01 January 2022 to 10 December 2022 for test1, test2, test3 for zone1, zone2, zone3`,
      );
    });

    it('should generate graph name with date formats', () => {
      const filters = {
        dateFrom: '2022-01-01',
        dateTo: '2022-02-28',
      };

      const graphName = service.domainLengthGraphName(filters);
      expect(graphName).toBe(
        'Length of newly created domains from 01 January 2022 to 28 February 2022 across all registrars for all zones',
      );
    });
  });
});
