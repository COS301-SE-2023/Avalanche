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
    await expect(
      service.formatTransactions(
        JSON.stringify([{ TRANSACTIONSBYREGISTRAR: [] }]),
      ),
    ).rejects.toThrow('Empty data array.');
  });

  it('should succesfully return chartdata when length is 4', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            Date: 'May 2022',
            Code: 'CO.ZA_CLOSED_REDEEM',
            Registrars: 'Afrihost',
            Quantity: 3,
          },
          {
            Date: 'May 2022',
            Code: 'CO.ZA_GRACE',
            Registrars: 'Afrihost',
            Quantity: 37,
          },
          {
            Date: 'May 2022',
            Code: 'CO.ZA_NEW',
            Registrars: 'Afrihost',
            Quantity: 1238,
          },
          {
            Date: 'May 2022',
            Code: 'CO.ZA_RENEW',
            Registrars: 'Afrihost',
            Quantity: 2132,
          },
          {
            Date: 'May 2022',
            Code: 'CO.ZA_TRANSFER',
            Registrars: 'Afrihost',
            Quantity: 24,
          },
          {
            Date: 'June 2022',
            Code: 'CO.ZA_CLOSED_REDEEM',
            Registrars: 'Afrihost',
            Quantity: 20,
          },
          {
            Date: 'June 2022',
            Code: 'CO.ZA_GRACE',
            Registrars: 'Afrihost',
            Quantity: 264,
          },
          {
            Date: 'June 2022',
            Code: 'CO.ZA_NEW',
            Registrars: 'Afrihost',
            Quantity: 19279,
          },
          {
            Date: 'June 2022',
            Code: 'CO.ZA_RENEW',
            Registrars: 'Afrihost',
            Quantity: 16214,
          },
          {
            Date: 'June 2022',
            Code: 'CO.ZA_TRANSFER',
            Registrars: 'Afrihost',
            Quantity: 338,
          },
          {
            Date: 'July 2022',
            Code: 'CO.ZA_CLOSED_REDEEM',
            Registrars: 'Afrihost',
            Quantity: 23,
          },
          {
            Date: 'July 2022',
            Code: 'CO.ZA_GRACE',
            Registrars: 'Afrihost',
            Quantity: 288,
          },
          {
            Date: 'July 2022',
            Code: 'CO.ZA_NEW',
            Registrars: 'Afrihost',
            Quantity: 10380,
          },
          {
            Date: 'July 2022',
            Code: 'CO.ZA_RENEW',
            Registrars: 'Afrihost',
            Quantity: 16814,
          },
          {
            Date: 'July 2022',
            Code: 'CO.ZA_TRANSFER',
            Registrars: 'Afrihost',
            Quantity: 341,
          },
          {
            Date: 'August 2022',
            Code: 'CO.ZA_CLOSED_REDEEM',
            Registrars: 'Afrihost',
            Quantity: 25,
          },
          {
            Date: 'August 2022',
            Code: 'CO.ZA_GRACE',
            Registrars: 'Afrihost',
            Quantity: 184,
          },
          {
            Date: 'August 2022',
            Code: 'CO.ZA_NEW',
            Registrars: 'Afrihost',
            Quantity: 4522,
          },
          {
            Date: 'August 2022',
            Code: 'CO.ZA_RENEW',
            Registrars: 'Afrihost',
            Quantity: 16785,
          },
          {
            Date: 'August 2022',
            Code: 'CO.ZA_TRANSFER',
            Registrars: 'Afrihost',
            Quantity: 347,
          },
          {
            Date: 'September 2022',
            Code: 'CO.ZA_CLOSED_REDEEM',
            Registrars: 'Afrihost',
            Quantity: 27,
          },
          {
            Date: 'September 2022',
            Code: 'CO.ZA_GRACE',
            Registrars: 'Afrihost',
            Quantity: 165,
          },
          {
            Date: 'September 2022',
            Code: 'CO.ZA_NEW',
            Registrars: 'Afrihost',
            Quantity: 3878,
          },
          {
            Date: 'September 2022',
            Code: 'CO.ZA_RENEW',
            Registrars: 'Afrihost',
            Quantity: 15986,
          },
          {
            Date: 'September 2022',
            Code: 'CO.ZA_TRANSFER',
            Registrars: 'Afrihost',
            Quantity: 354,
          },
        ],
      },
    ];
    const outp = await service.formatTransactions(JSON.stringify(data));
    console.log(outp);
    expect(outp).toBeDefined();
  });

  it('should successfully return chart data when the keys length is 3', async () => {
    const data = [
      {
        TRANSACTIONSBYREGISTRAR: [
          {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
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
    await expect(
      service.formatTransactions(JSON.stringify(data)),
    ).resolves.toEqual(JSON.stringify(expectedData));
  });
});
