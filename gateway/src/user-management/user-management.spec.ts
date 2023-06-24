/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserManagementService } from './user-management.service';
import { Observable, of } from 'rxjs';    

describe('UserManagementService function calls and defined', () => {
    let service: UserManagementService;
    let clientProxy: ClientProxy;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UserManagementService,
            {
              provide: 'USER_MANAGEMENT_SERVICE',
              useFactory: () => ClientProxyFactory.create({}),
            },
          ],
        }).compile();
    
        service = module.get<UserManagementService>(UserManagementService);
        clientProxy = module.get<ClientProxy>('USER_MANAGEMENT_SERVICE');
    });

    it("UserManagement defined", () => {
        expect(service).toBeDefined()
    })

    it('Usermanagement calls the correct proxy functions (register)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.register(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'register' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (verify)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.verify(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'verify' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (resendOTP)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.resendOTP(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'resendOTP' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (login)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.login(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'login' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (createOrganisation)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.createOrganisation(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'createOrganisation' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (getUserInfo)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.getUserInfo(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'getUserInfo' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (getMembers)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.getMembers(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'getMembers' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (createUserGroup)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.createUserGroup(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'createUserGroup' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (addUserToUserGroup)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.addUserToUserGroup(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'addUserToUserGroup' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (exitUserGroup)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.exitUserGroup(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'exitUserGroup' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (removeUserFromUserGroup)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.removeUserFromUserGroup(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'removeUserFromUserGroup' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (exitOrganisation)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.exitOrganisation(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'exitOrganisation' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (removeUserFromOrganisation)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.removeUserFromOrganisation(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'removeUserFromOrganisation' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (integrateUserWithWExternalAPI)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.integrateUserWithWExternalAPI(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'integrateUserWithWExternalAPI' }, data);
        expect(result).toBe(expectedResult)
    });

    it('Usermanagement calls the correct proxy functions (integrateWithDataProducts)', async () => {
        const data = { some: 'data' };
        const expectedResult = { success: true };
        const responseObservable = of(expectedResult);
      
        jest
        .spyOn(clientProxy, 'send').mockImplementationOnce(() => responseObservable);
      
        const result = await service.integrateWithDataProducts(data);
      
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'integrateWithDataProducts' }, data);
        expect(result).toBe(expectedResult)
    });

});

/*describe('UserManagementService (Integration)', () => {
    let service: UserManagementService;
    let clientProxy: ClientProxy;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserManagementService,
          {
            provide: 'USER_MANAGEMENT_SERVICE',
            useValue: ClientProxyFactory.create({
              transport: Transport.TCP,
              options: {
                host: 'localhost',
                port: 4001,
              },
            }),
          },
        ],
      }).compile();
  
      service = module.get<UserManagementService>(UserManagementService);
      clientProxy = module.get<ClientProxy>('USER_MANAGEMENT_SERVICE');
    });
  
    function oldTest(register: any) {
      it('should send registration data to the user management service and return the response', async () => {
        const data = { name: 'John Doe', email: 'john@example.com' };
        const expectedResult = { success: true };
  
        const result = await service.register(data);
  
        expect(clientProxy.send).toHaveBeenCalledWith({ cmd: 'register' }, data);
        expect(result).toEqual(expectedResult);
      });
    }
  });*/