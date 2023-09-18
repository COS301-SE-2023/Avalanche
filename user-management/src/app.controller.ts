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
    const result = await this.authService.register(data.email, data.password, data.firstName, data.lastName);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'verify' })
  async verify(data: any) {
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

  @MessagePattern({ cmd: 'checkUserAPIKey' })
  async checkUserAPIKey(data: any) {
    const result = await this.authService.checkUserAPIKey(data.token);

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
    const result = await this.userDashboardManService.saveDashbaord(data.token, data.dashboardID, data.name, data.graphs);
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
    const result = await this.userDashboardManService.editDashbaord(data.token, data.dashboardID, data.name, data.graphs);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'shareDashboards' })
  async shareDashboards(data: any) {
    const result = await this.userDashboardManService.shareDashboards(data.token, data.userGroupName, data.dashboardID);
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
    const result = await this.userDashboardManService.addCommentToGraph(data.token, data.dashboardID, data.graphName, data.comment);
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
  @MessagePattern({ cmd: 'integrateUserWithAfricaExternalAPI' })
  async integrateUserWithAfricaExternalAPI(data: any) {
    const result = await this.userDataProductManService.integrateUserWithAfricaExternalAPI(data.token, data.type, data.allocateToName, data.username, data.password, data.personal);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'integrateUserWithZARCExternalAPI' })
  async integrateUserWithZARCExternalAPI(data: any) {
    const result = await this.userDataProductManService.integrateUserWithZARCExternalAPI(data.token, data.type, data.allocateToName, data.username, data.password, data.personal);
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
  @MessagePattern({ cmd: 'addDomainWatchPassiveDetails' })
  async addDomainWatchPassiveDetails(data: any) {
    const result = await this.userDataProductManService.addDomainWatchPassiveDetails(data.token, data.types, data.domains);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'getDomainWatchPassive' })
  async getDomainWatchPassive(data: any) {
    const result = await this.userDataProductManService.getDomainWatchPassive();
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'getFilters' })
  async getFilters(data: any) {
    const result = await this.userDataProductManService.getFilters(data.token);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'getEndpoints' })
  async getEndpoints(data: any) {
    const result = await this.userDataProductManService.getEndpoints(data.token);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }

  @MessagePattern({ cmd: 'getDashboards' })
  async getDashboards(data: any) {
    const result = await this.userDataProductManService.getDashboards(data.token);
    if (result.error) {
      throw new RpcException({
        status: result.status,
        message: result.message,
        timestamp: result.timestamp,
      });
    }

    return result;
  }
  @MessagePattern({ cmd: 'getDomainWatchPassiveUser' })
  async getDomainWatchPassiveUser(data: any) {
    const result = await this.userDataProductManService.getDomainWatchPassiveUser(data.token);
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
