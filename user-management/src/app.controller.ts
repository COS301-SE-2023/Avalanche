/* eslint-disable prettier/prettier */
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { UserOrganisationMangementService } from './services/user-organisation/user-organisation-mangement.service';
import { UserDataProductMangementService } from './services/user-data-products/user-data-products-management.service';
import { UserUserGroupMangementService } from './services/user-userGroup/user-userGroup-management.service';
import { UserDashboardMangementService } from './services/user-dashboard/user-dashboard-management.service';

@Controller('user-management')
export class AppController {
  constructor(private readonly authService: AuthService,
    private readonly userOrgManService: UserOrganisationMangementService,
    private readonly userDataProductManService: UserDataProductMangementService,
    private readonly userUserGroupManService: UserUserGroupMangementService,
    private readonly userDashboardManService : UserDashboardMangementService) { }

  @MessagePattern({ cmd: 'register' })
  async register(data: any) {
    console.log("Registering user: ", data);
    return await this.authService.register(data.email, data.password, data.firstName, data.lastName);
  }
  @MessagePattern({ cmd: 'verify' })
  async verify(data: any) {
    console.log("Verifying user: ", data);
    const result = await this.authService.verify(data.email, data.otp);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'resendOTP' })
  async resendOTP(data: any) {
    console.log("Resending OTP: ", data);
    const result = await this.authService.resendOTP(data.email);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
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
  @MessagePattern({ cmd: 'createAPIKey' })
  async createAPIKey(data: any) {
    console.log("Creating key: ", data);
    const result = await this.authService.createAPIKey(data.token);

    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'rerollAPIKey' })
  async rerollAPIKey(data: any) {
    console.log("Rerolling key: ", data);
    const result = await this.authService.rerollAPIKey(data.token);

    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'saveDashboard' })
  async saveDashboard(data: any) {
    const result = await this.userDashboardManService.saveDashbaord(data.token, data.name, data.graphs);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'editDashboard' })
  async editDashboard(data: any) {
    const result = await this.userDashboardManService.editDashbaord(data.token, data.name, data.graphs);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'addCommentToGraph' })
  async addCommentToGraph(data: any) {
    const result = await this.userDashboardManService.addCommentToGraph(data.token, data.name, data.graphName, data.comment);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'getUserInfo' })
  async getUserInfo(data: any) {
    console.log("Get user info: ", data);
    const result = await this.authService.getUserInfo(data.token);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'getMembers' })
  async getMembers(data: any) {
    console.log("Get user info: ", data);
    const result = await this.userOrgManService.getMembers(data.token);
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
    const result = await this.userUserGroupManService.createUserGroup(data.token, data.name, data.permission);
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
    const result = await this.userUserGroupManService.addUserToUserGroup(data.token, data.userEmail, data.userGroupName);
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
    const result = await this.userUserGroupManService.exitUserGroup(data.token, data.userGroupName);
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
    const result = await this.userUserGroupManService.removeUserFromUserGroup(data.token, data.userGroupName, data.userEmail);
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
    const result = await this.userUserGroupManService.addUserToUserGroupWithKey(data.token, data.key);
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
