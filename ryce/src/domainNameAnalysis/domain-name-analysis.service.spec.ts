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
        24 * 60 * 60,
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
});
