/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ZacrController } from './zacr.controller';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { of } from 'rxjs';  

describe('ZacrController', () => {
    let controller: ZacrController;
    let clientProxy: ClientProxy;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ZacrController],
        providers: [
          {
            provide: 'ZACR_SERVICE',
            useFactory: () => ClientProxyFactory.create({}),
          },
        ],
      }).compile();
  
      controller = module.get<ZacrController>(ZacrController);
      clientProxy = module.get<ClientProxy>('ZACR_SERVICE');
    });
  
    describe('ZacrController', () => {
        it('should call the client proxy with the correct pattern and payload', async () => {
            const data = { some: 'data' };
            const expectedResult = { success: true };
            const responseObservable = of(expectedResult);
      
            jest
              .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable)
      
            const result = await controller.transactions(data);
      
            expect(clientProxy.send).toHaveBeenCalledWith(
              { cmd: 'transactions' },
              data,
            );
            expect(result).toEqual(expectedResult);
          });
    }); 
});
  