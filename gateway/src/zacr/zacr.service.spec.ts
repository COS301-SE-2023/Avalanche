import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { ZacrService } from './zacr.service';
import { of } from 'rxjs';

describe('ZacrService', () => {
  let service: ZacrService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZacrService,
        { provide: 'ZACR_SERVICE', useValue: { send: jest.fn() } },
      ],
    }).compile();

    service = module.get<ZacrService>(ZacrService);
    client = module.get<ClientProxy>('ZACR_SERVICE');
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
});
