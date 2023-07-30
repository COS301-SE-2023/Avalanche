import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MarketShareService } from './marketShare.service';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

describe('MarketShareService', () => {
  let service: MarketShareService;
  const mockRedis = { get: jest.fn(), set: jest.fn() };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockGraphFormatService = {
    formatMarketshare: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MarketShareService,
        JwtService,
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
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
      mockRedis.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await service.marketShare('filters', 'graphName');
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName:
            'Domain count marketshare across all registrars for all zones ',
          ...mockData,
        },
        timestamp: expect.any(String),
      });
    });

    it('should get formatted data from Snowflake and cache it if not available in cache', async () => {
      const mockQueryData = [{ data: 'test' }];
      const mockFormattedData = JSON.stringify({ formatted: 'test' });

      mockRedis.get.mockResolvedValue(null);
      mockSnowflakeService.execute.mockResolvedValue(mockQueryData);
      mockGraphFormatService.formatMarketshare.mockResolvedValue(
        mockFormattedData,
      );
      mockRedis.set.mockResolvedValue('OK');

      const result = await service.marketShare('filters', 'graphName');
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName:
            'Domain count marketshare across all registrars for all zones ',
          formatted: JSON.parse(mockFormattedData).formatted,
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('marketShareGraphName', () => {
    it('should return the correct graph name with parameters', () => {
      const filters = {
        rank: 'rank1',
        registrar: ['registrar1'],
        zone: ['zone1'],
      };
      const graphName = service.marketShareGraphName(filters);

      expect(graphName).toEqual(
        'Domain count marketshare for the rank1 registrars in terms of domain count across registrar1 for zone1',
      );
    });

    it('should return the correct graph name without parameters', () => {
      const filters = {};
      const graphName = service.marketShareGraphName(filters);

      expect(graphName).toEqual(
        'Domain count marketshare across all registrars for all zones ',
      );
    });
  });
});
