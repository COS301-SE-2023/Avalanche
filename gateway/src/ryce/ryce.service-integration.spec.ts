import { Test, TestingModule } from '@nestjs/testing';
import { RyceService } from './ryce.service';
import { ClientProxy } from '@nestjs/microservices';

describe('RyceService', () => {
  let service: RyceService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RyceService,
        { provide: 'RyCE_SERVICE', useValue: { send: jest.fn() } },
      ],
    }).compile();

    service = module.get<RyceService>(RyceService);
    client = module.get<ClientProxy>('RyCE_SERVICE');
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

});