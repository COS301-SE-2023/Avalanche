/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { ZacrService } from './zacr.service';
import { Observable, of } from 'rxjs';    

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

    it('Zacr calls the correct proxy functions (transactions)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.transactions(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'transactions' }, data);
        expect(result).toBe(expectedResult)
    });
});

