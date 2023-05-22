/* eslint-disable prettier/prettier */
import { Controller} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserOrganisationMangementService } from './services/user-organisation-mangement.service';
import { UserDataProductMangementService } from './services/user-data-products-management.service';

@Controller('user-management')
export class AppController {
  constructor(private readonly authService: AuthService, 
    private readonly userOrgManService: UserOrganisationMangementService,
    private readonly userDataProductManService : UserDataProductMangementService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    console.log("Registering user: ", data);
    return await this.authService.register(data.email, data.password, data.firstName, data.lastName);
  }
  @MessagePattern({ cmd: 'verify' })
  async verify(data: any) {
    console.log("Verifying user: ", data);
    return await this.authService.verify(data.email, data.otp);
  }
  @MessagePattern({ cmd: 'login' })
  async login(data: any) {
    console.log("Logging in user: ", data);
    return await this.authService.login(data.email, data.password);
  }
  @MessagePattern({ cmd: 'createOrganisation' })
  async createOrganisation(data: any) {
    console.log("Creating organisation: ", data);
    return await this.userOrgManService.createOrganisation(data.token, data.name);
  }
  @MessagePattern({ cmd: 'createUserGroup' })
  async createUserGroup(data: any) {
    console.log("Creating a user group: ", data);
    return await this.userOrgManService.createUserGroup(data.token, data.name, data.permission);
  }
  @MessagePattern({ cmd: 'addUserToUserGroup' })
  async addUserToUserGroup(data: any) {
    console.log("Adding a user to a user group: ", data);
    return await this.userOrgManService.addUserToUserGroup(data.token, data.userEmail, data.userGroupName);
  }
  @MessagePattern({ cmd: 'exitUserGroup' })
  async exitUserGroup(data: any) {
    console.log("Removing you from the user group: ", data);
    return await this.userOrgManService.exitUserGroup(data.token, data.userGroupName);
  }
  @MessagePattern({ cmd: 'removeUserFromUserGroup' })
  async removeUserFromUserGroup(data: any) {
    console.log("Removing a user from a user group: ", data);
    return await this.userOrgManService.removeUserFromUserGroup(data.token, data.userGroupName, data.userEmail);
  }
  @MessagePattern({ cmd: 'addUserToUserGroupWithKey' })
  async addUserToUserGroupWithKey(data: any) {
    console.log("Adding a user, with a key, to a user group: ", data);
    return await this.userOrgManService.addUserToUserGroupWithKey(data.token, data.key);
  }
  @MessagePattern({ cmd: 'integrateUserWithWExternalAPI' })
  async integrateUserWithWExternalAPI(data: any) {
    console.log("Integrating with DNS: ", data);
    return await this.userDataProductManService.integrateUserWithWExternalAPI(data.token, data.type, data.allocateToName, data.username, data.password, data.personal);
  }
}
