import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { AfricaController } from './africa.controller';
import { of } from 'rxjs';

describe('AfricaController', () => {
  let controller: AfricaController;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfricaController],
      providers: [{ provide: 'AFRICA_SERVICE', useValue: { send: jest.fn() } }],
    }).compile();

    controller = module.get<AfricaController>(AfricaController);
    client = module.get<ClientProxy>('AFRICA_SERVICE');
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
