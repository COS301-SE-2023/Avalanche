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

  describe('Transactions Format Service', () => {
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
          TRANSACTIONSBYREGISTRAR: JSON.stringify([
            {
              Date: 'July 2022',
              Code: 'CO.ZA_CLOSED_REDEEM',
              Registrars: 'Registrar1',
              Quantity: 23,
            },
            {
              Date: 'July 2022',
              Code: 'CO.ZA_GRACE',
              Registrars: 'Registrar1',
              Quantity: 288,
            },
            {
              Date: 'August 2022',
              Code: 'CO.ZA_CLOSED_REDEEM',
              Registrars: 'Registrar1',
              Quantity: 25,
            },
            {
              Date: 'August 2022',
              Code: 'CO.ZA_GRACE',
              Registrars: 'Registrar1',
              Quantity: 184,
            },
            {
              Date: 'September 2022',
              Code: 'CO.ZA_CLOSED_REDEEM',
              Registrars: 'Registrar1',
              Quantity: 27,
            },
            {
              Date: 'September 2022',
              Code: 'CO.ZA_GRACE',
              Registrars: 'Registrar1',
              Quantity: 165,
            },
          ]),
        },
      ];
      const outp = await service.formatTransactions(JSON.stringify(data));
      console.log(outp);
      expect(outp).toBeDefined();
    });

    it('should successfully return chart data when the keys length is 3', async () => {
      const data = [
        {
          TRANSACTIONSBYREGISTRAR: JSON.stringify([
            {
              key1: 'value1',
              key2: 'value2',
              key3: 'value3',
            },
          ]),
        },
      ];
      const expectedData = {
        labels: ['value1'],
        datasets: [
          {
            label: 'value2',
            data: ['value3'],
          },
        ],
      };
      await expect(
        service.formatTransactions(JSON.stringify(data)),
      ).resolves.toEqual(JSON.stringify(expectedData));
    });
  });

  describe('Marketshare Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatMarketshare(JSON.stringify([{ MARKETSHARE: [] }])),
      ).rejects.toThrow('Empty data array.');
    });

    it('should succesfully return chartdata when length is 2', async () => {
      const data = [
        {
          MARKETSHARE: JSON.stringify([
            {
              Registrar: 'Registrar1',
              NumInRegistry: 100,
            },
            {
              Registrar: 'Registrar2',
              NumInRegistry: 58,
            },
            {
              Registrar: 'Registrar3',
              NumInRegistry: 77,
            },
            {
              Registrar: 'Registrar4',
              NumInRegistry: 82,
            },
            {
              Registrar: 'Registrar5',
              NumInRegistry: 34,
            },
          ]),
        },
      ];

      const outp = await service.formatMarketshare(JSON.stringify(data));
      console.log(outp);
      expect(outp).toBeDefined();
    });
  });
});
