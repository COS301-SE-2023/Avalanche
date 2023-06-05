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

  it('should correctly format data with 3 key-value pairs per item', async () => {
    const testData = JSON.stringify({
      data: [
        {
          Code: 'CO.ZA_CLOSED_REDEEM',
          Date: '2023-01-02 00:00:00.000 -0800',
          Quantity: 98,
        },
        {
          Code: 'CO.ZA_GRACE',
          Date: '2023-01-02 00:00:00.000 -0800',
          Quantity: 85,
        },
        {
          Code: 'CO.ZA_NEW',
          Date: '2023-01-02 00:00:00.000 -0800',
          Quantity: 4077,
        },
        {
          Code: 'CO.ZA_RENEW',
          Date: '2023-01-02 00:00:00.000 -0800',
          Quantity: 18068,
        },
        {
          Code: 'CO.ZA_CLOSED_REDEEM',
          Date: '2023-01-09 00:00:00.000 -0800',
          Quantity: 83,
        },
        {
          Code: 'CO.ZA_GRACE',
          Date: '2023-01-09 00:00:00.000 -0800',
          Quantity: 899,
        },
        {
          Code: 'CO.ZA_NEW',
          Date: '2023-01-09 00:00:00.000 -0800',
          Quantity: 407,
        },
        {
          Code: 'CO.ZA_RENEW',
          Date: '2023-01-09 00:00:00.000 -0800',
          Quantity: 1806,
        },
      ],
    });

    const expectedOutput = {
      labels: [
        '2023-01-02 00:00:00.000 -0800',
        '2023-01-09 00:00:00.000 -0800',
      ],
      datasets: [
        {
          label: 'CO.ZA_CLOSED_REDEEM',
          data: [98, 83],
        },
        {
          label: 'CO.ZA_GRACE',
          data: [85, 899],
        },
        {
          label: 'CO.ZA_NEW',
          data: [4077, 407],
        },
        {
          label: 'CO.ZA_RENEW',
          data: [18068, 1806],
        },
      ],
    };

    const result = await service.format(testData);
    expect(JSON.parse(result)).toEqual(expectedOutput);
  });
});
