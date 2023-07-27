import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { TransactionService } from './transactions/transactions.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';
import { DomainNameAnalysisService } from './domainNameAnalysis/domain-name-analysis.service';
import { DomainWatchService } from './domainWatch/domain-watch-analysis.service';
import { MovementService } from './movement/movement.service';
import { RegistrarNameService } from './registrarName/registrarName.service';

describe('AppController', () => {
  let appController: AppController;
  let mockTransactionService;
  let mockMarketShareService;
  let mockAgeService;
  let mockDomainNameAnalysisService;
  let mockDomainWatchService;
  let mockMovementService;
  let mockRegistrarNameService;

  beforeEach(async () => {
    mockTransactionService = {
      transactions: jest.fn(),
      transactionsRanking: jest.fn(),
    };
    mockMarketShareService = { marketShare: jest.fn() };
    mockAgeService = { age: jest.fn() };
    mockDomainNameAnalysisService = {
      sendData: jest.fn(),
      domainNameAnalysisLength: jest.fn(),
      domainNameAnalysisCount: jest.fn(),
    };
    mockMovementService = { nettVeritical: jest.fn() };
    mockDomainWatchService = { passive: jest.fn(), loadDomains: jest.fn() };
    mockRegistrarNameService = { registrarName: jest.fn() };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        { provide: MarketShareService, useValue: mockMarketShareService },
        { provide: AgeService, useValue: mockAgeService },
        {
          provide: DomainNameAnalysisService,
          useValue: mockDomainNameAnalysisService,
        },
        { provide: MovementService, useValue: mockMovementService },
        {
          provide: DomainWatchService,
          useValue: mockDomainWatchService,
        },
        {
          provide: RegistrarNameService,
          useValue: mockRegistrarNameService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('transactions', () => {
    it('should return the result of transactions service', async () => {
      const result = 'test-result';
      const data = { filters: 'test-input', graphName: 'test-graph' };
      mockTransactionService.transactions.mockResolvedValue(result);

      expect(await appController.transactions(data)).toBe(result);
      expect(mockTransactionService.transactions).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
    });
  });

  describe('transactionsRanking', () => {
    it('should return the result of transactions service', async () => {
      const result = 'test-result';
      const data = { filters: 'test-input', graphName: 'test-graph' };
      mockTransactionService.transactionsRanking.mockResolvedValue(result);

      expect(await appController.transactionsRanking(data)).toBe(result);
      expect(mockTransactionService.transactionsRanking).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
    });
  });

  describe('marketShare', () => {
    it('should return the result of marketShare service', async () => {
      const result = 'test-result';
      const data = { filters: 'test-input', graphName: 'test-graph' };
      mockMarketShareService.marketShare.mockResolvedValue(result);

      expect(await appController.marketShare(data)).toBe(result);
      expect(mockMarketShareService.marketShare).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
    });
  });

  describe('age', () => {
    it('should return the result of age service', async () => {
      const result = 'test-result';
      const data = { filters: 'test-input', graphName: 'test-graph' };
      mockAgeService.age.mockResolvedValue(result);

      expect(await appController.age(data)).toBe(result);
      expect(mockAgeService.age).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
    });
  });

  describe('domainNameAnalysisCount', () => {
    it('should return the result of DomainNameAnalysis service', async () => {
      const result = 'test-result';
      const data = { someData: 'test-input' };
      mockDomainNameAnalysisService.sendData.mockResolvedValue(result);

      expect(await appController.domainNameAnalysisCount(data)).toBe(result);
      expect(mockDomainNameAnalysisService.sendData).toHaveBeenCalledWith(data);
    });
  });

  describe('domainNameAnalysisLength', () => {
    it('should return the result of DomainNameAnalysis service', async () => {
      const result = 'test-result';
      const data = { someData: 'test-input' };
      mockDomainNameAnalysisService.sendData.mockResolvedValue(result);

      expect(await appController.domainNameAnalysisLength(data)).toBe(result);
      expect(mockDomainNameAnalysisService.sendData).toHaveBeenCalledWith(data);
    });
  });

  describe('nettVerticalMovement', () => {
    it('should return the result of Movement service', async () => {
      const result = 'test-result';
      const data = { filters: 'test-input', graphName: 'test-graph' };
      mockMovementService.nettVeritical.mockResolvedValue(result);

      expect(await appController.nettVerticalMovement(data)).toBe(result);
      expect(mockMovementService.nettVeritical).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
    });
  });

  describe('domainWatchPassive', () => {
    it('should return the result of DomainWatch service', async () => {
      const result = 'test-result';
      mockDomainWatchService.passive.mockResolvedValue(result);

      expect(await appController.domainWatchPassive()).toBe(result);
      expect(mockDomainWatchService.passive).toHaveBeenCalled();
    });
  });

  describe('loadDomains', () => {
    it('should return the result of DomainWatch service', async () => {
      const result = 'test-result';
      mockDomainWatchService.loadDomains.mockResolvedValue(result);

      expect(await appController.loadDomains()).toBe(result);
      expect(mockDomainWatchService.loadDomains).toHaveBeenCalled();
    });
  });

  describe('registarName', () => {
    it('should return the result of RegistrarName service', async () => {
      const result = 'test-result';
      const data = { someData: 'test-input' };
      mockRegistrarNameService.registrarName.mockResolvedValue(result);

      expect(await appController.registarName(data)).toBe(result);
      expect(mockRegistrarNameService.registrarName).toHaveBeenCalledWith(data);
    });
  });
});
