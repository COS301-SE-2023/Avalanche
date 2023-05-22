/* eslint-disable prettier/prettier */
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
  async login(data: any) {
    return this.client.send({ cmd: 'login' }, data).toPromise();
  }
  async createOrganisation(data: any) {
    return this.client.send({ cmd: 'createOrganisation' }, data).toPromise();
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
