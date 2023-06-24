/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { ZacrService } from './zacr.service';

describe('ZacrService', () => {
    let service: ZacrService;
    let clientProxy: ClientProxy;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ZacrService,
          {
            provide: 'ZACR_SERVICE',
            useFactory: () => ClientProxyFactory.create({}),
          },
        ],
      }).compile();
  
      service = module.get<ZacrService>(ZacrService);
      clientProxy = module.get<ClientProxy>('ZACR_SERVICE');
    });

    it("Tests if service is defined", () => {
        expect(service).toBeDefined()
    })
});

