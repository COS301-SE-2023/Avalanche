import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { ZacrController } from './zacr.controller';
import { of } from 'rxjs';

describe('ZacrController', () => {
  let controller: ZacrController;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZacrController],
      providers: [{ provide: 'ZACR_SERVICE', useValue: { send: jest.fn() } }],
    }).compile();

    controller = module.get<ZacrController>(ZacrController);
    client = module.get<ClientProxy>('ZACR_SERVICE');
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
});
