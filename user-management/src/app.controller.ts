/* eslint-disable prettier/prettier */
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { UserOrganisationMangementService } from './services/user-organisation-mangement.service';
import { UserDataProductMangementService } from './services/user-data-products-management.service';

@Controller('user-management')
export class AppController {
  constructor(private readonly authService: AuthService,
    private readonly userOrgManService: UserOrganisationMangementService,
    private readonly userDataProductManService: UserDataProductMangementService) { }

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
  @MessagePattern({ cmd: 'resendOTP' })
  async resendOTP(data: any) {
    console.log("Resending OTP: ", data);
    return await this.authService.resendOTP(data.email);
  }
  @MessagePattern({ cmd: 'login' })
  async login(data: any) {
    console.log("Logging in user: ", data);
    const result = await this.authService.login(data.email, data.password);

    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'createOrganisation' })
  async createOrganisation(data: any) {
    console.log("Creating organisation: ", data);
    const result = await this.userOrgManService.createOrganisation(data.token, data.name);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'createUserGroup' })
  async createUserGroup(data: any) {
    console.log("Creating a user group: ", data);
    const result = await this.userOrgManService.createUserGroup(data.token, data.name, data.permission);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'addUserToUserGroup' })
  async addUserToUserGroup(data: any) {
    console.log("Adding a user to a user group: ", data);
    const result = await this.userOrgManService.addUserToUserGroup(data.token, data.userEmail, data.userGroupName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'exitUserGroup' })
  async exitUserGroup(data: any) {
    console.log("Removing you from the user group: ", data);
    const result = await this.userOrgManService.exitUserGroup(data.token, data.userGroupName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'removeUserFromUserGroup' })
  async removeUserFromUserGroup(data: any) {
    console.log("Removing a user from a user group: ", data);
    const result = await this.userOrgManService.removeUserFromUserGroup(data.token, data.userGroupName, data.userEmail);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'exitOrganisation' })
  async exitOrganisation(data: any) {
    console.log("Removing you from the organisation: ", data);
    const result = await this.userOrgManService.exitOrganisation(data.token, data.organisationName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'removeUserFromOrganisation' })
  async removeUserFromOrganisation(data: any) {
    console.log("Removing a user from an organisation: ", data);
    const result = await this.userOrgManService.removeUserFromOrganisation(data.token, data.organisationName, data.userEmail);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'addUserToUserGroupWithKey' })
  async addUserToUserGroupWithKey(data: any) {
    console.log("Adding a user, with a key, to a user group: ", data);
    const result = await this.userOrgManService.addUserToUserGroupWithKey(data.token, data.key);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'integrateUserWithWExternalAPI' })
  async integrateUserWithWExternalAPI(data: any) {
    console.log("Integrating with DNS: ", data);
    const result = await this.userDataProductManService.integrateUserWithWExternalAPI(data.token, data.type, data.allocateToName, data.username, data.password, data.personal);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'integrateWithDataProducts' })
  async integrateWithDataProducts(data: any) {
    console.log("Integrating with Data product: ", data);
    const result = await this.userDataProductManService.integrateWithDataProducts(data.token, data.type, data.allocateToName, data.personal);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
}
