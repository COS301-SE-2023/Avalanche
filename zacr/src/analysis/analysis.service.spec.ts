import { AnalysisService } from './analysis.service';
import * as ss from 'simple-statistics';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(() => {
    service = new AnalysisService();
  });

  it('should throw error for null', async () => {
    await expect(service.analyze(null)).rejects.toThrow('Invalid data');
  });

  it('should throw error for undefined', async () => {
    await expect(service.analyze(undefined)).rejects.toThrow('Invalid data');
  });

  it('should throw error for blank array', async () => {
    await expect(service.analyze([])).rejects.toThrow('Invalid data');
  });

  it('should throw error for data with less than two columns', async () => {
    await expect(service.analyze([{ a: 1 }, { a: 2 }])).rejects.toThrow(
      'Data should have at least two columns',
    );
  });

  it('should return correct result for valid data', async () => {
    const data = [
      { a: '2023-01-01 00:00:00.000 -0800', b: '100' },
      { a: '2023-01-02 00:00:00.000 -0800', b: '200' },
    ];
    const result = await service.analyze(data);
    expect(typeof result).toBe('string');
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('total');
    expect(parsedResult.total).toHaveProperty('data');
    expect(parsedResult.total).toHaveProperty('summary');
  });

  it('should group by series for data with more than two columns', async () => {
    const data = [
      { a: 'series1', b: '2023-01-01 00:00:00.000 -0800', c: '100' },
      { a: 'series2', b: '2023-01-02 00:00:00.000 -0800', c: '200' },
    ];
    const result = await service.analyze(data);
    const parsedResult = JSON.parse(result);
    expect(parsedResult).toHaveProperty('series1');
    expect(parsedResult).toHaveProperty('series2');
  });
});
