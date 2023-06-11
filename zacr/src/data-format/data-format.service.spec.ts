import { Test, TestingModule } from '@nestjs/testing';
import { DataFormatService } from './data-format.service';

// Mock csvtojson module
jest.mock('csvtojson', () => {
  return jest.fn().mockImplementation(() => {
    return {
      fromString: jest.fn().mockImplementation((csvString) => {
        const [firstLine, ...lines] = csvString.split('\n');
        const headers = firstLine.split(',');
        return lines.map((line) => {
          const row = {};
          const values = line.split(',');
          headers.forEach((header, i) => (row[header] = values[i]));
          return row;
        });
      }),
    };
  });
});

describe('DataFormatService', () => {
  let service: DataFormatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataFormatService],
    }).compile();

    service = module.get<DataFormatService>(DataFormatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly parse CSV data', async () => {
    const csvData = 'a,b,c\n1,2,3\n4,5,6';
    const expectedJson = [
      { a: '1', b: '2', c: '3' },
      { a: '4', b: '5', c: '6' },
    ];

    expect(await service.parse(csvData)).toEqual(expectedJson);
  });

  it('should correctly return JSON data', async () => {
    const jsonData = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 },
    ];
    const jsonStr = JSON.stringify(jsonData);

    expect(await service.parse(jsonStr)).toEqual(jsonData);
  });

  it('should throw an error for invalid data', async () => {
    const invalidData = 'invalid data';

    await expect(service.parse(invalidData)).rejects.toThrow();
  });
});
