import { Test, TestingModule } from '@nestjs/testing';
import { GraphFormatService } from './graph-format.service';

describe('GraphFormatService', () => {
  let service: GraphFormatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphFormatService],
    }).compile();

    service = module.get<GraphFormatService>(GraphFormatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error when data array is empty', async () => {
    await expect(service.format(JSON.stringify([{ TRANSACTIONSBYREGISTRAR: [] }]))).rejects.toThrow('Empty data array.');
  });

  it('should throw an error when the keys length is not 2 or 3', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
            'key4': 'value4',
          },
        ],
      },
    ];
    await expect(service.format(JSON.stringify(data))).rejects.toThrow('Invalid data structure.');
  });

  it('should successfully return chart data when the keys length is 3', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            'key1': 'value1',
            'key2': 'value2',
            'key3': 'value3',
          },
        ],
      },
    ];
    const expectedData = {
      labels: ['value2'],
      datasets: [
        {
          label: 'value1',
          data: ['value3'],
        },
      ],
    };
    await expect(service.format(JSON.stringify(data))).resolves.toEqual(JSON.stringify(expectedData));
  });
});
