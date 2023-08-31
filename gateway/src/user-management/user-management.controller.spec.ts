/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UserManagementController } from './user-mangement.controller';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('UserManagementController', () => {
  let controller: UserManagementController;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManagementController],
      providers: [
        {
          provide: 'USER_MANAGEMENT_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserManagementController>(UserManagementController);
    client = module.get<ClientProxy>('USER_MANAGEMENT_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const payload = { username: 'test' };
    const expectedResponse = { status: 'User registered' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.register(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'register' }, payload);
  });

  it('should throw an exception when registering a user fails', async () => {
    const payload = { username: 'test' };
    const errorResponse = { status: 500, message: 'An error occurred' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));

    await expect(controller.register(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'register' }, payload);
  });

  it('should login a user', async () => {
    const payload = { username: 'test' };
    const expectedResponse = { status: 'User logged in ' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));

    expect(await controller.login(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'login' }, payload);
  });

  it('should throw an exception when logging in a user fails', async () => {
    const payload = { username: 'test' };
    const errorResponse = { status: 500, message: 'An error occurred' };

    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));

    await expect(controller.login(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'login' }, payload);
  });

  it('should verify a user', async () => {
    const payload = { username: 'test' };
    const expectedResponse = { status: 'User verified' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.verify(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'verify' }, payload);
  });
  
  it('should throw an exception when verifying a user fails', async () => {
    const payload = { username: 'test' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.verify(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'verify' }, payload);
  });
  
  it('should resend OTP', async () => {
    const payload = { username: 'test' };
    const expectedResponse = { status: 'OTP resent' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.resendOTP(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'resendOTP' }, payload);
  });
  
  it('should throw an exception when resending OTP fails', async () => {
    const payload = { username: 'test' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.resendOTP(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'resendOTP' }, payload);
  });
  
  it('should get user info', async () => {
    const payload = { username: 'test' };
    const expectedResponse = { username: 'test', info: 'Some user info' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.getUserInfo(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'getUserInfo' }, payload);
  });
  
  it('should throw an exception when getting user info fails', async () => {
    const payload = { username: 'test' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.getUserInfo(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'getUserInfo' }, payload);
  });
  
  it('should get members', async () => {
    const payload = { groupId: '123' };
    const expectedResponse = { members: ['user1', 'user2'] };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.getMemebers(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'getMembers' }, payload);
  });
  
  it('should throw an exception when getting members fails', async () => {
    const payload = { groupId: '123' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.getMemebers(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'getMembers' }, payload);
  });

  it('should create organisation', async () => {
    const payload = { organisationName: 'testOrg' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.createOrganisation(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'createOrganisation' }, payload);
  });
  
  it('should throw an exception when creating organisation fails', async () => {
    const payload = { organisationName: 'testOrg' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.createOrganisation(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'createOrganisation' }, payload);
  });
  
  it('should create user group', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.createUserGroup(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'createUserGroup' }, payload);
  });
  
  it('should throw an exception when creating user group fails', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.createUserGroup(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'createUserGroup' }, payload);
  });

  it('should add user to user group', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.addUserToUserGroup(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'addUserToUserGroup' }, payload);
  });
  
  it('should throw an exception when adding user to user group', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.addUserToUserGroup(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'addUserToUserGroup' }, payload);
  });

  it('should add user to user group with key', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.addUserToUserGroupWithKey(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'addUserToUserGroupWithKey' }, payload);
  });
  
  it('should throw an exception when adding user to user group with key', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.addUserToUserGroupWithKey(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'addUserToUserGroupWithKey' }, payload);
  });

  it('exit user group', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.exitUserGroup(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'exitUserGroup' }, payload);
  });
  
  it('should throw an exception when exiting user group', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.exitUserGroup(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'exitUserGroup' }, payload);
  });

  it('exit org', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.exitOrganisation(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'exitOrganisation' }, payload);
  });
  
  it('should throw an exception when exiting user group', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.exitOrganisation(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'exitOrganisation' }, payload);
  });

  it('removing user from user group', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.removeUserFromUserGroup(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'removeUserFromUserGroup' }, payload);
  });
  
  it('should throw an exception when removing user from user group', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.removeUserFromUserGroup(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'removeUserFromUserGroup' }, payload);
  });

  it('removing user from org', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.removeUserFromOrganisation(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'removeUserFromOrganisation' }, payload);
  });
  
  it('should throw an exception when removing user from org', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.removeUserFromOrganisation(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'removeUserFromOrganisation' }, payload);
  });

  it('integrating with external', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.integrateUserWithZARCExternalAPI(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'integrateUserWithZARCExternalAPI' }, payload);
  });
  
  it('should throw an exception when integrating with external', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.integrateUserWithZARCExternalAPI(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'integrateUserWithZARCExternalAPI' }, payload);
  });

  it('integrating with data product', async () => {
    const payload = { groupName: 'testGroup' };
    const expectedResponse = { status: 'success' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => of(expectedResponse));
  
    expect(await controller.integrateWithDataProducts(payload)).toEqual(expectedResponse);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'integrateWithDataProducts' }, payload);
  });
  
  it('should throw an exception when integrating with data product', async () => {
    const payload = { groupName: 'testGroup' };
    const errorResponse = { status: 500, message: 'An error occurred' };
  
    jest.spyOn(client, 'send').mockImplementationOnce(() => throwError(new Error(errorResponse.message)));
  
    await expect(controller.integrateWithDataProducts(payload)).rejects.toThrow(
      new HttpException(errorResponse.message, errorResponse.status)
    );
    expect(client.send).toHaveBeenCalledWith({ cmd: 'integrateWithDataProducts' }, payload);
  });
});
