import { Test, TestingModule } from '@nestjs/testing';
import { SnowflakeService } from './snowflake.service';

describe('SnowflakeService', () => {
  let service: SnowflakeService;
  let mockSnowflakeConnection;

  beforeEach(async () => {
    mockSnowflakeConnection = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnowflakeService,
        {
          provide: 'SNOWFLAKE_CONNECTION',
          useValue: mockSnowflakeConnection,
        },
      ],
    }).compile();

    service = module.get<SnowflakeService>(SnowflakeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute a query successfully', async () => {
    const result = ['row1', 'row2'];
    const query = 'SELECT * FROM table';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(null, null, result),
    );

    expect(await service.execute(query)).toEqual(result);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Snowflake error');
    const query = 'SELECT * FROM table';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(error, null, null),
    );

    await expect(service.execute(query)).rejects.toEqual(error);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });

  it('should execute a different query correctly', async () => {
    const result = ['row3', 'row4'];
    const query = 'SELECT * FROM different_table';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(null, null, result),
    );

    expect(await service.execute(query)).toEqual(result);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });

  it('should handle different error correctly', async () => {
    const error = new Error('Different error');
    const query = 'SELECT * FROM different_table';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(error, null, null),
    );

    await expect(service.execute(query)).rejects.toEqual(error);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });

  it('should call a stored procedure correctly', async () => {
    const result = ['proc_result1', 'proc_result2'];
    const query = 'CALL procedure()';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(null, null, result),
    );

    expect(await service.execute(query)).toEqual(result);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });

  it('should handle errors from a stored procedure correctly', async () => {
    const error = new Error('Procedure error');
    const query = 'CALL procedure()';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(error, null, null),
    );

    await expect(service.execute(query)).rejects.toEqual(error);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });
  it('should call a different stored procedure correctly', async () => {
    const result = ['different_proc_result1', 'different_proc_result2'];
    const query = 'CALL different_procedure()';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(null, null, result),
    );

    expect(await service.execute(query)).toEqual(result);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });

  it('should handle errors from a different stored procedure correctly', async () => {
    const error = new Error('Different procedure error');
    const query = 'CALL different_procedure()';

    mockSnowflakeConnection.execute.mockImplementationOnce(({ complete }) =>
      complete(error, null, null),
    );

    await expect(service.execute(query)).rejects.toEqual(error);
    expect(mockSnowflakeConnection.execute).toHaveBeenCalledWith({
      sqlText: query,
      complete: expect.any(Function),
    });
  });
});
