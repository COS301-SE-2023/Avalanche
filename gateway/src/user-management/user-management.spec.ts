/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserManagementService } from './user-management.service';
import { of } from 'rxjs';    
import {User} from '../../../user-management/src/entity/user.entity'
//import { Redis } from 'ioredis';
import { getRepositoryToken } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';

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

describe('UserManagementService (Integration)', () => {
  let service: UserManagementService;
  let clientProxy: ClientProxy;
  //let mockRedis: jest.Mocked<Redis>;
  //let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {

    const redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

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
          //useFactory: () => ClientProxyFactory.create({})
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: 'REDIS',
          useValue: redis,
        }
      ],
    }).compile();

    service = module.get<UserManagementService>(UserManagementService);
    clientProxy = module.get<ClientProxy>('USER_MANAGEMENT_SERVICE');    
    //mockRedis = module.get('REDIS');
    //mockUserRepository = module.get(getRepositoryToken(User));
  });


  describe('register', () => {
    /*it('should send registration data to the user management service and return the response', async () => {
      const data = {firstName: 'John2', lastName: 'Doe2', email: 'john2@example.com', password: "yes"};

      mockRedis.set.mockResolvedValue('OK');

      const result = await service.register(data);
      console.log(result)

      expect(mockRedis.set).toBeCalled()
      expect(result).toBeDefined
    });*/

    it('should fail as there is no password', async () => {
      const data = {firstName: 'John2', lastName: 'Doe2', email: 'john2@example.com'};

      const result = await service.register(data);

      expect(result).toBeDefined
      expect(result.status).toBe(400)
      expect(result.error).toBe(true)
      expect(result.message).toBe("Missing info")

    })
  });

});
