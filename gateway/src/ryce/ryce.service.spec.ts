import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { RyceService } from './ryce.service';
import { of } from 'rxjs';

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

  it('should send transactions', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await service.transactions(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'transactions' }, data);
  });

  it('should send marketShare', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await service.marketShare(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'marketShare' }, data);
  });

  it('should send age', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await service.age(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'age' }, data);
  });

  it('should send transaction ranking', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await service.transactionsRanking(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'transactions-ranking' }, data);
  });

  it('should send domain name analysis count', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await service.domainNameAnalysisCount(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainNameAnalysis/count' }, data);
  });

  it('should send domain name analysis length', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await service.domainNameAnalysisLength(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainNameAnalysis/length' }, data);
  });
});
