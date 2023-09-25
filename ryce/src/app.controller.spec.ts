import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { TransactionService } from './transactions/transactions.service';
import { MarketShareService } from './marketShare/marketShare.service';
import { AgeService } from './age/age.service';
import { DomainNameAnalysisService } from './domainNameAnalysis/domain-name-analysis.service';
import { DomainWatchService } from './domainWatch/domain-watch-analysis.service';
import { MovementService } from './movement/movement.service';
import { RegistrarNameService } from './registrarName/registrarName.service';
import { RpcException } from '@nestjs/microservices';
import { QBeeService } from './qbee/qbee.service';

describe('AppController', () => {
  let appController: AppController;
  let mockTransactionService;
  let mockMarketShareService;
  let mockAgeService;
  let mockDomainNameAnalysisService;
  let mockDomainWatchService;
  let mockMovementService;
  let mockRegistrarNameService;
  let mockQBeeService;

  beforeEach(async () => {
    mockTransactionService = {
      transactions: jest.fn(),
      transactionsRanking: jest.fn(),
    };
    mockMarketShareService = { marketShare: jest.fn() };
    mockAgeService = { age: jest.fn() };
    mockDomainNameAnalysisService = {
      sendData: jest.fn(),
      domainLength: jest.fn(),
    };
    mockMovementService = { nettVeritical: jest.fn() };
    mockDomainWatchService = { passive: jest.fn(), loadDomains: jest.fn() };
    mockRegistrarNameService = { registrarName: jest.fn() };
    mockQBeeService = { executeQuery: jest.fn() };
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

        {
          provide: QBeeService,
          useValue: mockQBeeService,
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

    it('should throw an error if the transactions service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockTransactionService.transactions.mockResolvedValue(errorResult);

      await expect(appController.transactions(data)).rejects.toThrow(
        RpcException,
      );
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

    it('should throw an error if the transactions service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockTransactionService.transactionsRanking.mockResolvedValue(errorResult);

      await expect(appController.transactionsRanking(data)).rejects.toThrow(
        RpcException,
      );
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

    it('should throw an error if the marketshare service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockMarketShareService.marketShare.mockResolvedValue(errorResult);

      await expect(appController.marketShare(data)).rejects.toThrow(
        RpcException,
      );
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

    it('should throw an error if the age service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockAgeService.age.mockResolvedValue(errorResult);

      await expect(appController.age(data)).rejects.toThrow(RpcException);
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

    it('should throw an error if the Domain Name Analysis service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockDomainNameAnalysisService.sendData.mockResolvedValue(errorResult);

      await expect(appController.domainNameAnalysisCount(data)).rejects.toThrow(
        RpcException,
      );
      expect(mockDomainNameAnalysisService.sendData).toHaveBeenCalledWith(data);
    });
  });

  describe('domainNameAnalysisLength', () => {
    it('should return the result of DomainNameAnalysis service', async () => {
      const result = 'test-result';
      const data = { filters: 'test-input', graphName: 'test-graph' };
      mockDomainNameAnalysisService.domainLength.mockResolvedValue(result);

      expect(await appController.domainNameAnalysisLength(data)).toBe(result);
      expect(mockDomainNameAnalysisService.domainLength).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
    });

    it('should throw an error if the Domain Name Analysis service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockDomainNameAnalysisService.domainLength.mockResolvedValue(errorResult);

      await expect(
        appController.domainNameAnalysisLength(data),
      ).rejects.toThrow(RpcException);
      expect(mockDomainNameAnalysisService.domainLength).toHaveBeenCalledWith(
        data.filters,
        data.graphName,
      );
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

    it('should throw an error if the MKovement service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockMovementService.nettVeritical.mockResolvedValue(errorResult);

      await expect(appController.nettVerticalMovement(data)).rejects.toThrow(
        RpcException,
      );
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

    it('should throw an error if the Domain Watch service returns an error', async () => {
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockDomainWatchService.passive.mockResolvedValue(errorResult);

      await expect(appController.domainWatchPassive()).rejects.toThrow(
        RpcException,
      );
      expect(mockDomainWatchService.passive).toHaveBeenCalledWith();
    });
  });

  describe('loadDomains', () => {
    it('should return the result of DomainWatch service', async () => {
      const result = 'test-result';
      mockDomainWatchService.loadDomains.mockResolvedValue(result);

      expect(await appController.loadDomains()).toBe(result);
      expect(mockDomainWatchService.loadDomains).toHaveBeenCalled();
    });

    it('should throw an error if the DomainWatch service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockDomainWatchService.loadDomains.mockResolvedValue(errorResult);

      await expect(appController.loadDomains()).rejects.toThrow(RpcException);
      expect(mockDomainWatchService.loadDomains).toHaveBeenCalledWith();
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

    it('should throw an error if the RegistrarName service returns an error', async () => {
      const data = { filters: 'test-input', graphName: 'test-graph' };
      const errorResult = {
        error: true,
        status: 400,
        message: 'An error occurred',
        timestamp: new Date(),
      };
      mockRegistrarNameService.registrarName.mockResolvedValue(errorResult);

      await expect(appController.registarName(data.filters)).rejects.toThrow(
        RpcException,
      );
      expect(mockRegistrarNameService.registrarName).toHaveBeenCalledWith(
        data.filters,
      );
    });
  });
});
