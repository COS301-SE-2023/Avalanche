/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { of } from 'rxjs'; 
import { UserManagementController } from './user-mangement.controller';

describe('UserManagementController', () => {
    let controller: UserManagementController;
    let clientProxy: ClientProxy;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserManagementController],
        providers: [
          {
            provide: 'USER_MANAGEMENT_SERVICE',
            useFactory: () => ClientProxyFactory.create({}),
          },
        ],
      }).compile();
  
      controller = module.get<UserManagementController>(UserManagementController);
      clientProxy = module.get<ClientProxy>('USER_MANAGEMENT_SERVICE');
    });
  
    describe('register', () => {
        it('should call the client proxy with the correct pattern and payload', async () => {
            const data = { some: 'data' };
            const expectedResult = { success: true };
            const responseObservable = of(expectedResult);
      
            jest
              .spyOn(clientProxy, 'send')
              .mockImplementationOnce(() => responseObservable);
      
            const result = await controller.register(data);
      
            expect(clientProxy.send).toHaveBeenCalledWith(
              { cmd: 'register' },
              data,
            );
            expect(result).toEqual(expectedResult);
        });
    });
});
  