import { Test } from '@nestjs/testing';
import { AgeService } from './age.service';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { SnowflakeService } from '../snowflake/snowflake.service';
import { AnalysisService } from '../analysis/analysis.service';
import { GraphFormatService } from '../graph-format/graph-format.service';

describe('AgeService', () => {
  let service: AgeService;
  const mockJwtService = {};
  const mockRedis = { get: jest.fn(), set: jest.fn() };
  const mockSnowflakeService = { execute: jest.fn() };
  const mockDataFormatService = {};
  const mockAnalysisService = { analyze: jest.fn() };
  const mockGraphFormatService = { formatAgeAnalysis: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AgeService,
        { provide: 'REDIS', useValue: mockRedis },
        { provide: JwtService, useValue: mockJwtService },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
        { provide: AnalysisService, useValue: mockAnalysisService },
        { provide: GraphFormatService, useValue: mockGraphFormatService },
      ],
    }).compile();

    service = moduleRef.get<AgeService>(AgeService);
  });

  describe('age', () => {
    it('should correctly process age when data is not cached in Redis', async () => {
      const filters = JSON.stringify({ data: 'someData' });
      const graphName = 'graphName';
      const sqlQuery = `call ageAnalysis('${JSON.stringify(filters)}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockResolvedValue('queryData');
      mockGraphFormatService.formatAgeAnalysis.mockResolvedValue(
        JSON.stringify({ format: 'formattedData' }),
      );

      // Call the method under test
      const result = await service.age(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`ryce${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);
      expect(mockGraphFormatService.formatAgeAnalysis).toHaveBeenCalledWith(
        JSON.stringify('queryData'),
      );
      expect(mockRedis.set).toHaveBeenCalledWith(
        `ryce${sqlQuery}`,
        JSON.stringify({ format: 'formattedData' }),
        'EX',
        72 * 60 * 60,
      );

      // Expect the result to be the final formatted data
      expect(result.status).toBe('success');
    });

    it('should correctly process transactions when data is already cached in Redis', async () => {
      let filters = 'someData';
      const graphName = 'graphName';

      // Set up mocks
      mockRedis.get.mockResolvedValue(JSON.stringify({ cache: 'cachedData' })); // Simulate Redis cache hit

      // Call the method under test
      const result = await service.age(filters, graphName);

      filters = JSON.stringify(filters);
      const sqlQuery = `call ageAnalysis('${filters}')`;

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`ryce${sqlQuery}`);

      // Expect the result to be the final formatted data
      expect(result.status).toBe('success');
    });

    it('should return error response when Snowflake service fails', async () => {
      const filters = JSON.stringify({ data: 'someData' });
      const graphName = 'graphName';
      const sqlQuery = `call ageAnalysis('${JSON.stringify(filters)}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Data Warehouse Error'),
      );

      // Call the method under test
      const result = await service.age(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`ryce${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);

      // Expect the result to be an error message
      expect(result.status).toBe(500);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Data Warehouse Error');
    });

    it('should correctly throw an error when transaction format fails', async () => {
      const filters = JSON.stringify({ data: 'someData' });
      const graphName = 'graphName';
      const sqlQuery = `call ageAnalysis('${JSON.stringify(filters)}')`;

      // Set up mocks
      mockRedis.get.mockResolvedValue(null); // Simulate Redis cache miss
      mockSnowflakeService.execute.mockResolvedValue('queryData');
      mockGraphFormatService.formatAgeAnalysis.mockResolvedValue(
        new Error('Format error'),
      );

      // Call the method under test
      const result = await service.age(filters, graphName);

      // Expect the mocks to have been called with the correct arguments
      expect(mockRedis.get).toHaveBeenCalledWith(`ryce${sqlQuery}`);
      expect(mockSnowflakeService.execute).toHaveBeenCalledWith(sqlQuery);
      expect(mockGraphFormatService.formatAgeAnalysis).toHaveBeenCalledWith(
        JSON.stringify('queryData'),
      );

      // Expect the result to be error
      expect(result.status).toBe(500);
      expect(result.error).toBe(true);
    });
  });

  describe('ageGraphName', () => {
    it('should handle no filters and return default name', () => {
      const filters = {};
      const result = service.ageGraphName(filters);
      expect(result).toBe('Age Analysis of domains for all registrars ');
    });

    it('should handle rank filter', () => {
      const filters = { rank: 'top' };
      const result = service.ageGraphName(filters);
      expect(result).toBe(
        'Age Analysis of domains for the top registrars in terms of domain count ',
      );
    });

    it('should handle overall and average both true', () => {
      const filters = { overall: true, average: true };
      const result = service.ageGraphName(filters);
      expect(result).toBe(
        'Age Analysis of domains for all registrars , showing the overall average age',
      );
    });

    it('should handle overall false and average true', () => {
      const filters = { overall: false, average: true };
      const result = service.ageGraphName(filters);
      expect(result).toBe(
        'Age Analysis of domains for all registrars , showing the average age per registrar',
      );
    });

    it('should handle overall true and average false', () => {
      const filters = { overall: true, average: false };
      const result = service.ageGraphName(filters);
      expect(result).toBe(
        'Age Analysis of domains for all registrars , showing the overall number of domains per age',
      );
    });

    it('should handle overall and average both false', () => {
      const filters = { overall: false, average: false };
      const result = service.ageGraphName(filters);
      expect(result).toBe(
        'Age Analysis of domains for all registrars , showing the number of domains per age per registrar',
      );
    });

    it('should handle all filters', () => {
      const filters = { rank: 'top', overall: true, average: false };
      const result = service.ageGraphName(filters);
      expect(result).toBe(
        'Age Analysis of domains for the top registrars in terms of domain count , showing the overall number of domains per age',
      );
    });
  });
});
