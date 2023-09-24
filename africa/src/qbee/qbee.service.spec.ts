import { Test, TestingModule } from '@nestjs/testing';
import { QBeeService } from './qbee.service';
import { SnowflakeService } from '../snowflake/snowflake.service';

jest.mock('../snowflake/snowflake.service');

describe('QBeeService', () => {
  let service: QBeeService;
  const mockSnowflakeService = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QBeeService,
        {
          provide: SnowflakeService,
          useValue: mockSnowflakeService,
        },
      ],
    }).compile();

    service = module.get<QBeeService>(QBeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeQuery', () => {
    it('should return success when snowflake service executes successfully', async () => {
      mockSnowflakeService.execute.mockResolvedValue('Query Success');

      const result = await service.executeQuery('SQL_QUERY');
      expect(result).toEqual("Query Success");
    });

    it('should return an error object when snowflake service throws an error', async () => {
      mockSnowflakeService.execute.mockRejectedValue(
        new Error('Snowflake Error'),
      );

      const result = await service.executeQuery('SQL_QUERY');
      expect(result).toHaveProperty('status', 500);
      expect(result).toHaveProperty('error', true);
      expect(result).toHaveProperty(
        'message',
        'Data Warehouse Error while trying to execute QBee statement',
      );
      expect(result).toHaveProperty('timestamp');
    });
  });
});
