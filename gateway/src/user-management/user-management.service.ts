/* eslint-disable prettier/prettier */
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject('USER_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
  ) {}
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
      return this.client.send({ cmd: 'login' }, data).toPromise();
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
  async removeUserFromUserGroup(data: any){
    return this.client.send({cmd: 'removeUserFromUserGroup'}, data).toPromise();
  }
  async exitOrganisation(data: any) {
    return this.client.send({ cmd: 'exitOrganisation' }, data).toPromise();
  }
  async removeUserFromOrganisation(data: any){
    return this.client.send({cmd: 'removeUserFromOrganisation'}, data).toPromise();
  }
  async addUserToUserGroupWithKey(data: any) {
    return this.client.send({ cmd: 'addUserToUserGroupWithKey' }, data).toPromise();
  }
  async integrateUserWithWExternalAPI(data: any) {
    return this.client.send({ cmd: 'integrateUserWithWExternalAPI' }, data).toPromise();
  }
  async integrateWithDataProducts(data: any) {
    return this.client.send({ cmd: 'integrateWithDataProducts' }, data).toPromise();
  }
}
