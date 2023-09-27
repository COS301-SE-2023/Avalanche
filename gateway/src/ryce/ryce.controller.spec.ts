import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { RyceController } from './ryce.controller';
import { of } from 'rxjs';

describe('RyceController', () => {
  let controller: RyceController;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RyceController],
      providers: [{ provide: 'RyCE_SERVICE', useValue: { send: jest.fn() } }],
    }).compile();

    controller = module.get<RyceController>(RyceController);
    client = module.get<ClientProxy>('RyCE_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should post transactions', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest
      .spyOn(client, 'send')
      .mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.transactions(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'transactions' }, data);
  });

  it('should post marketShare', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest
      .spyOn(client, 'send')
      .mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.marketShare(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'marketShare' }, data);
  });

  it('should post age', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest
      .spyOn(client, 'send')
      .mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.age(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'age' }, data);
  });

  it('should post transaction ranking', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest
      .spyOn(client, 'send')
      .mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.transactionsRaking(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'transactions-ranking' }, data);
  });

  it('should post domain name analysis count', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest
      .spyOn(client, 'send')
      .mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.domainNameAnalysisCount(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainNameAnalysis/count' }, data);
  });

  it('should post domain name analysis length', async () => {
    const data = { key: 'value' };
    const expectedResponse = { status: 'success' };

    jest
      .spyOn(client, 'send')
      .mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.domainNameAnalysisLength(data)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'domainNameAnalysis/length' }, data);
  });
});
