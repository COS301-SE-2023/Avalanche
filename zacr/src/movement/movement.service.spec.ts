import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MovementService } from './movement.service';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { GraphFormatService } from '../graph-format/graph-format.service';
import { AnalysisService } from '../analysis/analysis.service';

describe('MovementService', () => {
  let service: MovementService;
  const mockRedis = { get: jest.fn(), set: jest.fn() };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockGraphFormatService = {
    formatNettVertical: jest.fn(),
  };
  const mockStatisticalAnalysis = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MovementService,
        JwtService,
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
        { provide: AnalysisService, useValue: mockStatisticalAnalysis },
      ],
    }).compile();

    service = moduleRef.get<MovementService>(MovementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nettVeritical', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      // Spy on the domainLengthGraphName method and mock its implementation
      spy = jest
        .spyOn(service, 'netVerticalGraphName')
        .mockImplementation(() => 'graph Name');
    });

    afterEach(() => {
      // Restore the original implementation after each test
      spy.mockRestore();
    });
    it('should return formatted data from cache if available', async () => {
      // Mock Redis get() to return some data
      mockRedis.get.mockResolvedValue(
        JSON.stringify({
          data: { chartData: {}, jsonData: {} },
          filters: 'filters',
        }),
      );

      const result = await service.nettVeritical('filters', 'graphName');
      console.log(result);
      expect(mockRedis.get).toBeCalled();
      expect(mockSnowflakeService.execute).not.toBeCalled();
      expect(result.data).toEqual({
        graphName: 'graph Name',
        data: { chartData: {}, jsonData: {} },
        warehouse: 'zacr',
        graphType: 'movement/vertical',
        chartType: 'Bar',
        filters: 'filters',
      });
    });

    it('should execute snowflake query and store in cache if not available', async () => {
      // Mock Redis get() to return null and set() to store data
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue(null);
      mockSnowflakeService.execute.mockResolvedValue([
        { NETTVERTICALMOVEMENT: { data: 'data', filters: 'filters' } },
      ]);

      const result = await service.nettVeritical('filters', 'graphName');

      expect(mockRedis.get).toBeCalled();
      expect(mockSnowflakeService.execute).toBeCalled();
      expect(mockRedis.set).toBeCalledWith(
        'zacrcall nettVerticalMovement(\'"filters"\')',
        expect.any(String),
        'EX',
        24 * 60 * 60,
      );
      expect(result.data).toEqual({
        graphName: 'graph Name',
        data: {
          chartData: { datasets: [{ label: 'Vertical Movement' }] },
          jsonData: 'data',
        },
        warehouse: 'zacr',
        graphType: 'movement/vertical',
        filters: 'filters',
        chartType: 'Bar',
      });
    });

    it('should return error response if snowflake query fails', async () => {
      // Mock Redis get() to return null and set() to store data
      mockRedis.get.mockResolvedValue(null);
      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Data Warehouse Error'),
      );

      const result = await service.nettVeritical('filters', 'graphName');

      expect(result.status).toEqual(500);
      expect(result.error).toEqual(true);
      expect(result.message).toEqual('Data Warehouse Error');
    });
  });

  describe('netVerticalGraphName', () => {
    it('should return correct graph name based on filters', () => {
      const filters = {
        registrar: ['reg1', 'reg2'],
        zone: ['zone1', 'zone2'],
        dateFrom: '2021-01-01',
        dateTo: '2021-12-31',
        granularity: 'year',
      };
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain('Yearly');
      expect(result).toContain('reg1, reg2');
      expect(result).toContain('zone1,zone2');
      expect(result).toContain('1 Jan 2021 to 31 Dec 2021');
    });

    it('should handle empty filters', () => {
      const filters = {};
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain(
        'Monthly Net Vertical Movement (Creates-Deletes) from NaN undefined NaN to NaN undefined NaN for all registrars (all zones)',
      );
    });

    it('should handle registrar filter', () => {
      const filters = { registrar: ['reg1', 'reg2'] };
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain(' for reg1, reg2');
    });

    it('should handle zone filter', () => {
      const filters = { zone: ['zone1', 'zone2'] };
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain('(zone1,zone2)');
    });

    it('should handle dateFrom and dateTo filters', () => {
      const filters = { dateFrom: '2022-01-01', dateTo: '2022-12-31' };
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain(' from 1 Jan 2022 to 31 Dec 2022');
    });

    it('should handle granularity filter', () => {
      const filters = { granularity: 'year' };
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain(
        'Yearly Net Vertical Movement (Creates-Deletes) from',
      );
    });

    it('should handle weekly', () => {
      const filters = {
        granularity: 'week',
      };
      const result = service.netVerticalGraphName(filters);

      expect(result).toContain('Weekly');
    });

    it('should handle all filters', () => {
      const filters = {
        registrar: ['reg1', 'reg2'],
        zone: ['zone1', 'zone2'],
        dateFrom: '2022-01-01',
        dateTo: '2022-12-31',
        granularity: 'day',
      };
      const result = service.netVerticalGraphName(filters);

      expect(result).toEqual(
        'Daily Net Vertical Movement (Creates-Deletes) from 1 Jan 2022 to 31 Dec 2022 for reg1, reg2 (zone1,zone2)',
      );
    });
  });
});
