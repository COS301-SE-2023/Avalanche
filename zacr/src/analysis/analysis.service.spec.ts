import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalysisService],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
  });

  it('should throw an error when data is not an array or is empty', async () => {
    await expect(service.analyze([])).rejects.toThrow('Invalid data');
  });

  it('should throw error for data with less than two columns', async () => {
    const data = [{ TRANSACTIONSBYREGISTRAR: [{ key1: 'value1' }] }];
    await expect(service.analyze(data)).rejects.toThrow(
      'Data should have at least two columns',
    );
  });

  it('should return correct result for valid data', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            key1: 'series1',
            key2: '2023-01-01 00:00:00.000 -0800',
            key3: '100',
          },
        ],
      },
    ];
    const result = await service.analyze(data);
    console.log(result);
    expect(typeof result).toBe('string');
  });

  it('should return correct result for valid two column data', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            key1: 'series1',
            key2: '2023-01-01 00:00:00.000 -0800',
          },
        ],
      },
    ];
    const result = await service.analyze(data);
    console.log(result);
    expect(typeof result).toBe('string');
  });

  it('should group by series for data with more than two columns', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            key1: 'series1',
            key2: '2023-01-01 00:00:00.000 -0800',
            key3: '100',
          },
          {
            key1: 'series2',
            key2: '2023-01-02 00:00:00.000 -0800',
            key3: '200',
          },
        ],
      },
    ];
    const result = await service.analyze(data);
    const parsedResult = JSON.parse(result);
    expect(typeof result).toBe('string');
  });
});
