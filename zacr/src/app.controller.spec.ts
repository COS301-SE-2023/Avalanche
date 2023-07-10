import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { TransactionService } from './transactions/transactions.service';

describe('AppController', () => {
  let appController: AppController;
  let mockTransactionService;

  beforeEach(async () => {
    mockTransactionService = { transactions: jest.fn() };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
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
});
