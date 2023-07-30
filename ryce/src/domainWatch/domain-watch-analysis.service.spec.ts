import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { DomainWatchService } from './domain-watch-analysis.service';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

jest.mock('@nestjs/axios');
describe('DomainWatchService', () => {
  let service: DomainWatchService;
  const mockHttpService = { post: jest.fn() };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockGraphFormatService = {
    formatDomainLengthAnalysis: jest.fn(),
    formatDomainNameAnalysis: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DomainWatchService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
      ],
    }).compile();

    service = moduleRef.get<DomainWatchService>(DomainWatchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('passive', () => {
    it('should return query data if no error', async () => {
      const mockData = { result: 'test' };
      mockSnowflakeService.execute.mockResolvedValue(mockData);

      const result = await service.passive();

      expect(result).toEqual({ queryData: mockData });
      expect(mockSnowflakeService.execute).toBeCalledWith(
        `call domainWatchPassive('')`,
      );
    });

    it('should return error data if error', async () => {
      const error = new Error('Test Error');
      mockSnowflakeService.execute.mockRejectedValue(error);

      const result = await service.passive();

      expect(result.error).toEqual(true);
      expect(result.status).toEqual(500);
      expect(result.message).toEqual('Data Warehouse Error');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('loadDomains', () => {
    it('should return query data if no error', async () => {
      const mockData = { result: 'test' };
      mockSnowflakeService.execute.mockResolvedValue(mockData);

      const result = await service.loadDomains();

      expect(result).toEqual({ queryData: mockData });
      expect(mockSnowflakeService.execute).toBeCalledWith(`call loadDomains()`);
    });

    it('should return error data if error', async () => {
      const error = new Error('Test Error');
      mockSnowflakeService.execute.mockRejectedValue(error);

      const result = await service.loadDomains();

      expect(result.error).toEqual(true);
      expect(result.status).toEqual(500);
      expect(result.message).toEqual('Data Warehouse Error');
      expect(result.timestamp).toBeDefined();
    });
  });
});
