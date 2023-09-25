import { Test, TestingModule } from '@nestjs/testing';
import { RegistrarNameService } from './registrarName.service';
import { SnowflakeService } from '../snowflake/snowflake.service';

describe('RegistrarNameService', () => {
  let service: RegistrarNameService;
  const mockSnowflakeService = { execute: jest.fn() };
  const mockRedis = { get: jest.fn(), set: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrarNameService,
        { provide: 'REDIS', useValue: mockRedis },
        { provide: SnowflakeService, useValue: mockSnowflakeService },
      ],
    }).compile();

    service = module.get<RegistrarNameService>(RegistrarNameService);
  });

  it('should return registrar name', async () => {
    const mockResult = [{ Name: 'mockData' }];
    mockSnowflakeService.execute.mockResolvedValue(mockResult);

    const result = await service.registrarName({ code: 'testCode' });

    expect(result).toEqual({
      status: 'success',
      data: { name: 'mockData' },
      timestamp: expect.any(String),
    });
    expect(mockSnowflakeService.execute).toHaveBeenCalledWith(
      `SELECT distinct(drr."Name")
      FROM DATA_WAREHOUSE.REGISTRY."Dim Registry Registrar" drr
      where drr."Code" = 'testCode';`,
    );
  });

  it('should handle data warehouse error', async () => {
    mockSnowflakeService.execute.mockRejectedValue(new Error());

    const result = await service.registrarName({ code: 'testCode' });

    expect(result).toEqual({
      status: 500,
      error: true,
      message: 'Data Warehouse Error',
      timestamp: expect.any(String),
    });
  });
});
