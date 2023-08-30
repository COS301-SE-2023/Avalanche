/* eslint-disable prettier/prettier */
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Console } from 'console';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject('USER_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
  ) { }
  async register(data: any) {
    console.log("In register");
    return this.client.send({ cmd: 'register' }, data).toPromise();
  }
  async verify(data: any) {
    return this.client.send({ cmd: 'verify' }, data).toPromise();
  }
  async resendOTP(data: any) {
    return this.client.send({ cmd: 'resendOTP' }, data).toPromise();
  }
  async login(data: any) {
    console.log("login data:",data);
    return this.client.send({ cmd: 'login' }, data).toPromise();
  }
  async createAPIKey(data: any) {
    return this.client.send({ cmd: 'createAPIKey' }, data).toPromise();
  }
  async checkUserAPIKey(data: any) {
    return this.client.send({ cmd: 'checkUserAPIKey' }, data).toPromise();
  }
  async rerollAPIKey(data: any) {
    return this.client.send({ cmd: 'rerollAPIKey' }, data).toPromise();
  }
  async saveDashboard(data: any) {
    return this.client.send({ cmd: 'saveDashboard' }, data).toPromise();
  }
  async shareDashboards(data: any) {
    return this.client.send({ cmd: 'shareDashboards' }, data).toPromise();
  }
  async editDashboard(data: any) {
    return this.client.send({ cmd: 'editDashboard' }, data).toPromise();
  }
  async addCommentToGraph(data: any) {
    return this.client.send({ cmd: 'addCommentToGraph' }, data).toPromise();
  }
  async createOrganisation(data: any) {
    return this.client.send({ cmd: 'createOrganisation' }, data).toPromise();
  }
  async getUserInfo(data: any) {
    return this.client.send({ cmd: 'getUserInfo' }, data).toPromise();
  }
  async getMembers(data: any) {
    return this.client.send({ cmd: 'getMembers' }, data).toPromise();
  }
  async createUserGroup(data: any) {
    return this.client.send({ cmd: 'createUserGroup' }, data).toPromise();
  }
  async addUserToUserGroup(data: any) {
    return this.client.send({ cmd: 'addUserToUserGroup' }, data).toPromise();
  }
  async exitUserGroup(data: any) {
    return this.client.send({ cmd: 'exitUserGroup' }, data).toPromise();
  }
  async removeUserFromUserGroup(data: any) {
    return this.client.send({ cmd: 'removeUserFromUserGroup' }, data).toPromise();
  }
  async exitOrganisation(data: any) {
    return this.client.send({ cmd: 'exitOrganisation' }, data).toPromise();
  }
  async removeUserFromOrganisation(data: any) {
    return this.client.send({ cmd: 'removeUserFromOrganisation' }, data).toPromise();
  }
  async addUserToUserGroupWithKey(data: any) {
    return this.client.send({ cmd: 'addUserToUserGroupWithKey' }, data).toPromise();
  }
  async integrateUserWithAfricaExternalAPI(data: any) {
    return this.client.send({ cmd: 'integrateUserWithAfricaExternalAPI' }, data).toPromise();
  }
  async integrateUserWithZARCExternalAPI(data: any) {
    return this.client.send({ cmd: 'integrateUserWithZARCExternalAPI' }, data).toPromise();
  }
  async integrateWithDataProducts(data: any) {
    return this.client.send({ cmd: 'integrateWithDataProducts' }, data).toPromise();
  }
  async addDomainWatchPassiveDetails(data: any) {

    return this.client.send({ cmd: 'addDomainWatchPassiveDetails' }, data).toPromise();
  }
  async getDomainWatchPassive(data: any) {
    return this.client.send({ cmd: 'getDomainWatchPassive' }, data).toPromise();
  }
  async getDomainWatchPassiveUser(data: any) {
    return this.client.send({ cmd: 'getDomainWatchPassiveUser' }, data).toPromise();
  }
  async getFilters(data: any) {
    return this.client.send({ cmd: 'getFilters' }, data).toPromise();
  }
  async getEndpoints(data: any) {
    return this.client.send({ cmd: 'getEndpoints' }, data).toPromise();
  }
}
