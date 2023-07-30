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
          JSON.stringify([{ TRANSACTIONSBYREGISTRAR: JSON.stringify([]) }]),
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

  describe('Transactions Ranking Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatTransactionsRanking(
          JSON.stringify([{ TRANSACTIONSBYREGISTRAR: JSON.stringify([]) }]),
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
      const outp = await service.formatTransactionsRanking(
        JSON.stringify(data),
      );
      expect(outp).toBeDefined();
    });

    // Add additional tests as needed
  });

  describe('Domain Name Analysis Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatDomainNameAnalysis(JSON.stringify({ data: [] })),
      ).rejects.toThrow('Empty data array.');
    });

    it('should successfully return chart data when the keys length is 3', async () => {
      const data = {
        data: [
          {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
          },
        ],
      };
      await expect(
        service.formatDomainNameAnalysis(JSON.stringify(data)),
      ).toBeDefined();
    });
  });

  describe('Domain Length Analysis Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatDomainLengthAnalysis(
          JSON.stringify([{ DOMAINLENGTHANALYSIS: JSON.stringify([]) }]),
        ),
      ).rejects.toThrow('Empty data array.');
    });

    it('should successfully return chart data when the keys length is 2', async () => {
      const data = [
        {
          DOMAINLENGTHANALYSIS: JSON.stringify([
            {
              key1: 'value1',
              key2: 'value2',
            },
          ]),
        },
      ];
      await expect(
        service.formatDomainLengthAnalysis(JSON.stringify(data)),
      ).toBeDefined();
    });
  });

  describe('Nett Vertical Movement Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatNettVertical(
          JSON.stringify([{ NETTVERTICALMOVEMENT: JSON.stringify([]) }]),
        ),
      ).rejects.toThrow('Empty data array.');
    });

    it('should successfully return chart data when the keys length is 2', async () => {
      const data = [
        {
          NETTVERTICALMOVEMENT: JSON.stringify([
            {
              key1: 'value1',
              key2: 'value2',
            },
          ]),
        },
      ];
      await expect(
        service.formatNettVertical(JSON.stringify(data)),
      ).toBeDefined();
    });

    it('should successfully return chart data when the keys length is 3', async () => {
      const data = [
        {
          NETTVERTICALMOVEMENT: JSON.stringify([
            {
              key1: 'value1',
              key2: 'value2',
              key3: 'value3',
            },
          ]),
        },
      ];
      await expect(
        service.formatNettVertical(JSON.stringify(data)),
      ).toBeDefined();
    });
  });

  describe('Marketshare Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatMarketshare(
          JSON.stringify([{ MARKETSHARE: JSON.stringify([]) }]),
        ),
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

  describe('Age Analysis Format Service', () => {
    it('should throw an error when data array is empty', async () => {
      await expect(
        service.formatAgeAnalysis(
          JSON.stringify([{ AGEANALYSIS: JSON.stringify([]) }]),
        ),
      ).rejects.toThrow('Empty data array.');
    });

    it('should succesfully return chartdata when length is 2', async () => {
      const data = [
        {
          AGEANALYSIS: JSON.stringify([
            {
              Registrar: 'Registrar1',
              NumInRegistry: 4,
            },
            {
              Registrar: 'Registrar2',
              NumInRegistry: 3,
            },
            {
              Registrar: 'Registrar3',
              NumInRegistry: 7,
            },
            {
              Registrar: 'Registrar4',
              NumInRegistry: 4,
            },
            {
              Registrar: 'Registrar5',
              NumInRegistry: 5,
            },
          ]),
        },
      ];

      const outp = await service.formatAgeAnalysis(JSON.stringify(data));
      console.log(outp);
      expect(outp).toBeDefined();
    });

    it('should succesfully return chartdata when length is 3', async () => {
      const data = [
        {
          AGEANALYSIS: JSON.stringify([
            {
              Age: 1,
              Registrar: 'Registrar1',
              NumInRegistry: 4,
            },
            {
              Age: 2,
              Registrar: 'Registrar1',
              NumInRegistry: 3,
            },
            {
              Age: 1,
              Registrar: 'Registrar2',
              NumInRegistry: 7,
            },
            {
              Age: 2,
              Registrar: 'Registrar2',
              NumInRegistry: 4,
            },
            {
              Age: 1,
              Registrar: 'Registrar3',
              NumInRegistry: 5,
            },
          ]),
        },
      ];

      const outp = await service.formatAgeAnalysis(JSON.stringify(data));
      console.log(outp);
      expect(outp).toBeDefined();
    });
  });
});
