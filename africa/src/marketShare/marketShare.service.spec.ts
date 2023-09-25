import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MarketShareService } from './marketShare.service';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { RegistrarNameService } from '../registrarName/registrarName.service';

describe('MarketShareService', () => {
  let service: MarketShareService;
  const mockRedis = { get: jest.fn(), set: jest.fn() };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockGraphFormatService = {
    formatMarketshare: jest.fn(),
  };
  const mockRegistrarNameService = { registrarName: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MarketShareService,
        JwtService,
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
        { provide: RegistrarNameService, useValue: mockRegistrarNameService },
      ],
    }).compile();

    service = moduleRef.get<MarketShareService>(MarketShareService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('marketShare', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      // Spy on the domainLengthGraphName method and mock its implementation
      spy = jest
        .spyOn(service, 'marketShareGraphName')
        .mockImplementation(() => 'graph Name');
    });

    afterEach(() => {
      // Restore the original implementation after each test
      spy.mockRestore();
    });
    it('should get formatted data from cache if available', async () => {
      const mockData = { data: 'test' };
      mockRedis.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await service.marketShare('filters', 'graphName');
      expect(result).toEqual({
        status: 'success',
        data: {
          graphName: 'graph Name',
          data: 'test',
          warehouse: 'africa',
          graphType: 'marketShare',
          chartType: 'PolarArea',
          filters: undefined,
        },
        timestamp: expect.any(String),
      });
    });

    it('should get formatted data from Snowflake and cache it if not available in cache', async () => {
      const mockQueryData = [
        { DOMAINCOUNT: { data: [{}] }, MARKETSHARE: { data: [{}] } },
      ];
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
          graphName: 'graph Name',
          data: {
            chartData: { datasets: [{ label: 'Marketshare' }] },
            jsonData: expect.any(Object),
          },
          filters: undefined,
          warehouse: 'africa',
          graphType: 'marketShare',
          chartType: 'PolarArea',
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
        'The rank1 registrars (i.t.o. domain count) (Specifically also including: registrar1) (zone1)',
      );
    });

    it('should return the correct graph name without parameters', () => {
      const filters = {};
      const graphName = service.marketShareGraphName(filters);

      expect(graphName).toEqual('The top5 (all zones)');
    });
  });
});
