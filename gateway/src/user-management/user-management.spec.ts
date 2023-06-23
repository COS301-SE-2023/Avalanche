/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { UserManagementService } from './user-management.service';
    
describe('UserManagementService', () => {
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
});
