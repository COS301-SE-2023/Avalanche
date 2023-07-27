import { Test, TestingModule } from '@nestjs/testing';
import { AfricaService } from './africa.service';
import { ClientProxy } from '@nestjs/microservices';

describe('AfricaService', () => {
  let service: AfricaService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AfricaService,
        { provide: 'AFRICA_SERVICE', useValue: { send: jest.fn() } },
      ],
    }).compile();

    service = module.get<AfricaService>(AfricaService);
    client = module.get<ClientProxy>('AFRICA_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call transactions with correct parameters', async () => {
    const data = { test: 'test' };
    service.transactions(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'transactions' }, data);
  });

  it('should call transactionsRanking with correct parameters', async () => {
    const data = { test: 'test' };
    service.transactionsRanking(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'transactions-ranking' }, data);
  });

  it('should call marketShare with correct parameters', async () => {
    const data = { test: 'test' };
    service.marketShare(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'marketShare' }, data);
  });

  it('should call age with correct parameters', async () => {
    const data = { test: 'test' };
    service.age(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'age' }, data);
  });

  it('should call domainNameAnalysisCount with correct parameters', async () => {
    const data = { test: 'test' };
    service.domainNameAnalysisCount(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainNameAnalysis/count' }, data);
  });

  it('should call domainNameAnalysisLength with correct parameters', async () => {
    const data = { test: 'test' };
    service.domainNameAnalysisLength(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainNameAnalysis/length' }, data);
  });

  it('should call domainWatchPassive with correct parameters', async () => {
    const data = { test: 'test' };
    service.domainWatchPassive(data);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainWatchPassive' }, data);
  });
});

