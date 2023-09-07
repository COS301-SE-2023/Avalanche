/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Counter, Histogram , Registry} from 'prom-client';

const register = new Registry();
export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1],
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);
@Controller('user-management')
export class UserManagementController {
  constructor(@Inject('USER_MANAGEMENT_SERVICE') private client: ClientProxy) { }
  @Post('getFilters')
    async getFromFile(@Body() data: any) {
      const end = httpRequestDurationMicroseconds.startTimer();
      const pattern = { cmd: 'getFilters' };
      const payload = data;
      try {
        const result = await lastValueFrom(this.client.send(pattern, payload));
        httpRequestsTotal.inc({ method: 'POST', route: 'getFilters', code: 200 });
        end({ method: 'POST', route: 'getFilters', code: 200 });
        return result;
      } catch (error) {
        const rpcError = error
        httpRequestsTotal.inc({ method: 'POST', route: 'getFilters', code: rpcError.status });
        end({ method: 'POST', route: 'getFilters', code: rpcError.status });
        if (typeof rpcError === 'object') {
          throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
        }
        throw error;
      }
    }
    @Post('getEndpoints')
    async getEndpoints(@Body() data: any) {
      const end = httpRequestDurationMicroseconds.startTimer();
      const pattern = { cmd: 'getEndpoints' };
      const payload = data;
      try {
        const result = await lastValueFrom(this.client.send(pattern, payload));
        httpRequestsTotal.inc({ method: 'POST', route: 'getEndpoints', code: 200 });
        end({ method: 'POST', route: 'getEndpoints', code: 200 });
        return result;
      } catch (error) {
        const rpcError = error
        httpRequestsTotal.inc({ method: 'POST', route: 'getEndpoints', code: rpcError.status });
        end({ method: 'POST', route: 'getEndpoints', code: rpcError.status });
        if (typeof rpcError === 'object') {
          throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
        }
        throw error;
      }
    }  
  @Post('register')
  async register(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'register' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'register', code: 200 });
        end({ method: 'POST', route: 'register', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'register', code: rpcError.status });
        end({ method: 'POST', route: 'register', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('verify')
  @HttpCode(200)
  async verify(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'verify' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'verify', code: 200 });
        end({ method: 'POST', route: 'verify', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'verify', code: rpcError.status });
        end({ method: 'POST', route: 'verify', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('resendOTP')
  @HttpCode(200)
  async resendOTP(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'resendOTP' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'resendOTP', code: 200 });
        end({ method: 'POST', route: 'resendOTP', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'resendOTP', code: rpcError.status });
        end({ method: 'POST', route: 'resendOTP', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'login' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'login', code: 200 });
        end({ method: 'POST', route: 'login', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'login', code: rpcError.status });
        end({ method: 'POST', route: 'login', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('createAPIKey')
  @HttpCode(200)
  async createAPIKey(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'createAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'createAPIKey', code: 200 });
        end({ method: 'POST', route: 'createAPIKey', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'createAPIKey', code: rpcError.status });
        end({ method: 'POST', route: 'createAPIKey', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('checkUserAPIKey')
  @HttpCode(200)
  async checkUserAPIKey(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'checkUserAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'checkUserAPIKey', code: 200 });
        end({ method: 'POST', route: 'checkUserAPIKey', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'checkUserAPIKey', code: rpcError.status });
        end({ method: 'POST', route: 'checkUserAPIKey', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('rerollAPIKey')
  @HttpCode(200)
  async rerollAPIKey(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'rerollAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'rerollAPIKey', code: 200 });
        end({ method: 'POST', route: 'rerollAPIKey', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'rerollAPIKey', code: rpcError.status });
        end({ method: 'POST', route: 'rerollAPIKey', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('saveDashboard')
  async saveDashboard(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'saveDashboard' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'saveDashboard', code: 200 });
        end({ method: 'POST', route: 'saveDashboard', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'saveDashboard', code: rpcError.status });
        end({ method: 'POST', route: 'saveDashboard', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('shareDashboards')
  @HttpCode(200)
  async shareDashboards(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'shareDashboards' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'shareDashboards', code: 200 });
        end({ method: 'POST', route: 'shareDashboards', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'shareDashboards', code: rpcError.status });
        end({ method: 'POST', route: 'shareDashboards', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('editDashboard')
  @HttpCode(200)
  async editDashboard(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'editDashboard' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'editDashboard', code: 200 });
        end({ method: 'POST', route: 'editDashboard', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'editDashboard', code: rpcError.status });
        end({ method: 'POST', route: 'editDashboard', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addCommentToGraph')
  @HttpCode(200)
  async addCommentToGraph(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'addCommentToGraph' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'addCommentToGraph', code: 200 });
        end({ method: 'POST', route: 'addCommentToGraph', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'addCommentToGraph', code: rpcError.status });
        end({ method: 'POST', route: 'addCommentToGraph', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getUserInfo')
  @HttpCode(200)
  async getUserInfo(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'getUserInfo' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'getUserInfo', code: 200 });
        end({ method: 'POST', route: 'getUserInfo', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'getUserInfo', code: rpcError.status });
        end({ method: 'POST', route: 'getUserInfo', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getMembers')
  @HttpCode(200)
  async getMemebers(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'getMembers' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'getMembers', code: 200 });
        end({ method: 'POST', route: 'getMembers', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'getMembers', code: rpcError.status });
        end({ method: 'POST', route: 'getMembers', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('createOrganisation')
  @HttpCode(200)
  async createOrganisation(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'createOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'createOrganisation', code: 200 });
        end({ method: 'POST', route: 'createOrganisation', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'createOrganisation', code: rpcError.status });
        end({ method: 'POST', route: 'createOrganisation', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('createUserGroup')
  @HttpCode(200)
  async createUserGroup(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'createUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'createUserGroup', code: 200 });
        end({ method: 'POST', route: 'createUserGroup', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'createUserGroup', code: rpcError.status });
        end({ method: 'POST', route: 'createUserGroup', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addUserToUserGroup')
  @HttpCode(200)
  async addUserToUserGroup(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'addUserToUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'addUserToUserGroup', code: 200 });
        end({ method: 'POST', route: 'addUserToUserGroup', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'addUserToUserGroup', code: rpcError.status });
        end({ method: 'POST', route: 'addUserToUserGroup', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('exitUserGroup')
  @HttpCode(200)
  async exitUserGroup(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'exitUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'exitUserGroup', code: 200 });
        end({ method: 'POST', route: 'exitUserGroup', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'exitUserGroup', code: rpcError.status });
        end({ method: 'POST', route: 'exitUserGroup', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('removeUserFromUserGroup')
  @HttpCode(200)
  async removeUserFromUserGroup(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'removeUserFromUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'removeUserFromUserGroup', code: 200 });
        end({ method: 'POST', route: 'removeUserFromUserGroup', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'removeUserFromUserGroup', code: rpcError.status });
        end({ method: 'POST', route: 'removeUserFromUserGroup', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('exitOrganisation')
  @HttpCode(200)
  async exitOrganisation(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'exitOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'exitOrganisation', code: 200 });
        end({ method: 'POST', route: 'exitOrganisation', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'exitOrganisation', code: rpcError.status });
        end({ method: 'POST', route: 'exitOrganisation', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('removeUserFromOrganisation')
  @HttpCode(200)
  async removeUserFromOrganisation(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'removeUserFromOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'removeUserFromOrganisation', code: 200 });
        end({ method: 'POST', route: 'removeUserFromOrganisation', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'removeUserFromOrganisation', code: rpcError.status });
        end({ method: 'POST', route: 'removeUserFromOrganisation', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addUserToUserGroupWithKey')
  @HttpCode(200)
  async addUserToUserGroupWithKey(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'addUserToUserGroupWithKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'addUserToUserGroupWithKey', code: 200 });
        end({ method: 'POST', route: 'addUserToUserGroupWithKey', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'addUserToUserGroupWithKey', code: rpcError.status });
        end({ method: 'POST', route: 'addUserToUserGroupWithKey', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateUserWithAfricaExternalAPI')
  async integrateUserWithAfricaExternalAPI(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'integrateUserWithAfricaExternalAPI' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'integrateUserWithAfricaExternalAPI', code: 200 });
        end({ method: 'POST', route: 'integrateUserWithAfricaExternalAPI', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'integrateUserWithAfricaExternalAPI', code: rpcError.status });
        end({ method: 'POST', route: 'integrateUserWithAfricaExternalAPI', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateUserWithZARCExternalAPI')
  async integrateUserWithZARCExternalAPI(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'integrateUserWithZARCExternalAPI' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'integrateUserWithZARCExternalAPI', code: 200 });
        end({ method: 'POST', route: 'integrateUserWithZARCExternalAPI', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'integrateUserWithZARCExternalAPI', code: rpcError.status });
        end({ method: 'POST', route: 'integrateUserWithZARCExternalAPI', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateWithDataProducsts')
  @HttpCode(200)
  async integrateWithDataProducts(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'integrateWithDataProducts' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'integrateWithDataProducts', code: 200 });
        end({ method: 'POST', route: 'integrateWithDataProducts', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'integrateWithDataProducts', code: rpcError.status });
        end({ method: 'POST', route: 'integrateWithDataProducts', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addDomainWatchPassiveDetails')
  @HttpCode(200)
  async addDomainWatchPassiveDetails(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'addDomainWatchPassiveDetails' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'addDomainWatchPassiveDetails', code: 200 });
        end({ method: 'POST', route: 'addDomainWatchPassiveDetails', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'addDomainWatchPassiveDetails', code: rpcError.status });
        end({ method: 'POST', route: 'addDomainWatchPassiveDetails', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getDomainWatchPassive')
  @HttpCode(200)
  async getDomainWatchPassive(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'getDomainWatchPassive' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'getDomainWatchPassive', code: 200 });
        end({ method: 'POST', route: 'getDomainWatchPassive', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'getDomainWatchPassive', code: rpcError.status });
        end({ method: 'POST', route: 'getDomainWatchPassive', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getDomainWatchPassiveUser')
  @HttpCode(200)
  async getDomainWatchPassiveUser(@Body() data: any) {
    const end = httpRequestDurationMicroseconds.startTimer();
    const pattern = { cmd: 'getDomainWatchPassiveUser' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      httpRequestsTotal.inc({ method: 'POST', route: 'getDomainWatchPassiveUser', code: 200 });
      end({ method: 'POST', route: 'getDomainWatchPassiveUser', code: 200 });
      return result;
    } catch (error) {
      const rpcError = error;
      httpRequestsTotal.inc({ method: 'POST', route: 'getDomainWatchPassiveUser', code: rpcError.status });
        end({ method: 'POST', route: 'getDomainWatchPassiveUser', code: rpcError.status });
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}
