/* eslint-disable prettier/prettier */
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MarketShareService } from './marketShare.service';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

// Mock Redis instance
const mockRedisInstance = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return mockRedisInstance;
  });
});

describe('MarketShareService', () => {
  let service: MarketShareService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MarketShareService,
        JwtService,
        { provide: 'REDIS', useValue: mockRedisInstance },
        SnowflakeService,
        GraphFormatService
      ],
    }).compile();

    service = moduleRef.get<MarketShareService>(MarketShareService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('marketShare', () => {
    it('should get formatted data from cache if available', async () => {
      const mockData = { data: 'test' };
      mockRedisInstance.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await service.marketShare('filters', 'graphName');
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName: 'graphName',
          ...mockData,
        },
        timestamp: expect.any(String),
      });
    });

    it('should get formatted data from Snowflake and cache it if not available in cache', async () => {
      const mockQueryData = [{ data: 'test' }];
      const mockFormattedData = "{ 'formatted': 'test' }";

      mockRedisInstance.get.mockResolvedValue(null);
      jest.spyOn(SnowflakeService.prototype, 'execute').mockResolvedValue(mockQueryData);
      jest.spyOn(GraphFormatService.prototype, 'formatMarketshare').mockResolvedValue(mockFormattedData);
      mockRedisInstance.set.mockResolvedValue('OK');

      const result = await service.marketShare('filters', 'graphName');
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName: 'graphName',
          mockFormattedData,
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('marketShareGraphName', () => {
    it('should return the correct graph name', () => {
      const filters = JSON.stringify({ rank: 'rank', registrar: ['registrar'], zone: ['zone'] });
      const graphName = service.marketShareGraphName(filters);

      expect(graphName).toEqual('Domain count marketshare  for the rank  across registrar  for zone');
    });
  });
});
