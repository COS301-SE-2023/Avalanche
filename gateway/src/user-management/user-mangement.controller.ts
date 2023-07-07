/* eslint-disable prettier/prettier */
import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeStamp } from 'console';
import { lastValueFrom } from 'rxjs';

@Controller('user-management')
export class UserManagementController {
  constructor(@Inject('USER_MANAGEMENT_SERVICE') private client: ClientProxy) { }

  @Post('register')
  async register(@Body() data: any) {
    const pattern = { cmd: 'register' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('verify')
  async verify(@Body() data: any) {
    const pattern = { cmd: 'verify' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('resendOTP')
  async resendOTP(@Body() data: any) {
    const pattern = { cmd: 'resendOTP' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('login')
  async login(@Body() data: any) {
    const pattern = { cmd: 'login' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('createAPIKey')
  async createAPIKey(@Body() data: any) {
    const pattern = { cmd: 'createAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('rerollAPIKey')
  async rerollAPIKey(@Body() data: any) {
    const pattern = { cmd: 'rerollAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('saveDashboard')
  async saveDashboard(@Body() data: any) {
    const pattern = { cmd: 'saveDashboard' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getUserInfo')
  async getUserInfo(@Body() data: any) {
    const pattern = { cmd: 'getUserInfo' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getMembers')
  async getMemebers(@Body() data: any) {
    const pattern = { cmd: 'getMembers' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('createOrganisation')
  async createOrganisation(@Body() data: any) {
    const pattern = { cmd: 'createOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('createUserGroup')
  async createUserGroup(@Body() data: any) {
    const pattern = { cmd: 'createUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addUserToUserGroup')
  async addUserToUserGroup(@Body() data: any) {
    const pattern = { cmd: 'addUserToUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('exitUserGroup')
  async exitUserGroup(@Body() data: any) {
    const pattern = { cmd: 'exitUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('removeUserFromUserGroup')
  async removeUserFromUserGroup(@Body() data: any) {
    const pattern = { cmd: 'removeUserFromUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('exitOrganisation')
  async exitOrganisation(@Body() data: any) {
    const pattern = { cmd: 'exitOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('removeUserFromOrganisation')
  async removeUserFromOrganisation(@Body() data: any) {
    const pattern = { cmd: 'removeUserFromOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addUserToUserGroupWithKey')
  async addUserToUserGroupWithKey(@Body() data: any) {
    const pattern = { cmd: 'addUserToUserGroupWithKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateUserWithWExternalAPI')
  async integrateUserWithWExternalAPI(@Body() data: any) {
    const pattern = { cmd: 'integrateUserWithWExternalAPI' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateWithDataProducsts')
  async integrateWithDataProducts(@Body() data: any) {
    const pattern = { cmd: 'integrateWithDataProducts' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}
