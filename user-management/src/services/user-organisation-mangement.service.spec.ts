/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserGroup } from '../entity/userGroup.entity';
import { Organisation } from '../entity/organisation.entity';
import { Repository } from 'typeorm';
import { UserOrganisationMangementService } from './user-organisation-mangement.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

describe('UserOrganisationMangementService', () => {
  let userOrganisationMangementService: UserOrganisationMangementService;
  let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;
  let mockUserGroupRepository: jest.Mocked<Partial<Repository<UserGroup>>>;
  let mockOrganisationRepository: jest.Mocked<Partial<Repository<Organisation>>>;
  let mockRedis: jest.Mocked<Redis>;

  const mockUser = new User();
  const mockUserGroup = new UserGroup();
  const mockOrganisation = new Organisation();

  beforeEach(async () => {
    const userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const userGroupRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const organisationRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const redis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOrganisationMangementService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(UserGroup),
          useValue: userGroupRepository,
        },
        {
          provide: getRepositoryToken(Organisation),
          useValue: organisationRepository,
        },
        {
          provide: 'REDIS', // Provide the mock redis service
          useValue: redis,
        },
        ConfigService
      ],
    }).compile();

    userOrganisationMangementService = module.get<UserOrganisationMangementService>(UserOrganisationMangementService);
    mockUserRepository = module.get(getRepositoryToken(User));
    mockUserGroupRepository = module.get(getRepositoryToken(UserGroup));
    mockOrganisationRepository = module.get(getRepositoryToken(Organisation));
    mockRedis = module.get('REDIS');
  });

  it('should be defined', () => {
    expect(userOrganisationMangementService).toBeDefined();
  });

  describe('createUserGroup', () => {
    const token = 'validToken';
    const name = 'group_name';
    const permission = 1;

    it('should return invalid token error if token does not exist', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      expect(await userOrganisationMangementService.createUserGroup(token, name, permission)).toEqual({
        status: 400,
        error: true,
        message: 'Invalid token',
        timestamp: expect.any(String),
      });
    });

    it('should return "User does not exist" if user payload does not exist', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(null));
      expect(await userOrganisationMangementService.createUserGroup(token, name, permission)).toEqual({
        status: 'failure',
        message: 'User does not exist',
        timestamp: expect.any(String),
      });
    });

    it('should return "Organisation does not exist please create one" if organisation does not exist', async () => {
      const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 1 }] };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockOrganisationRepository.findOne.mockResolvedValueOnce(null);
      expect(await userOrganisationMangementService.createUserGroup(token, name, permission)).toEqual({
        status: 400,
        error: true,
        message: 'Organisation does not exist please create one',
        timestamp: expect.any(String),
      });
    });

    it('should return "Please enter a user group name with characters and a length greater than zero" if user group name is empty', async () => {
      const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 1 }] };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockOrganisationRepository.findOne.mockResolvedValueOnce(mockOrganisation);
      expect(await userOrganisationMangementService.createUserGroup(token, '', permission)).toEqual({
        status: 400,
        error: true,
        message: 'Please enter a user group name with characters and a length greater than zero',
        timestamp: expect.any(String),
      });
    });

    it('should return "User does not have the permissions to do so" if user permission is not 1', async () => {
      const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 2 }] };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      expect(await userOrganisationMangementService.createUserGroup(token, name, permission)).toEqual({
        status: 'failure',
        message: 'User does not have the permissions to do so',
        timestamp: expect.any(String),
      });
    });

    it('should return "success" and created userGroup object if userGroup is created', async () => {
      const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 1 }] };
      const userGroup = new UserGroup();
      userGroup.name = name;
      userGroup.permission = permission;
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockOrganisationRepository.findOne.mockResolvedValueOnce(mockOrganisation);
      mockUserGroupRepository.save.mockResolvedValueOnce(userGroup);
      const result = await userOrganisationMangementService.createUserGroup(token, name, permission);
      expect(result.status).toEqual('success');
      expect(result.message).toEqual(userGroup);
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('addUserToUserGroup', () => {
    it('should add a user to a user group', async () => {
      const mockBearerToken = `Bearer mockToken`;
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(mockUserGroup);
      mockUserGroup.users = [];
      const result = await userOrganisationMangementService.addUserToUserGroup(mockBearerToken, mockUser.email, mockUserGroup.name);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(mockUserGroupRepository.findOne).toHaveBeenCalledWith({ name: mockUserGroup.name }, { relations: ['users'] });
      expect(mockUserGroup.users.includes(mockUser)).toBeTruthy();
      expect(mockUserGroupRepository.save).toHaveBeenCalledWith(mockUserGroup);
      expect(result).toEqual(mockUserGroup);
    });
  });

  describe('removeUserFromUserGroup', () => {
    it('should remove a user from a user group', async () => {
      const mockBearerToken = `Bearer mockToken`;
      mockUserGroup.users = [mockUser];
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(mockUserGroup);
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, mockUser.email, mockUserGroup.name);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(mockUserGroupRepository.findOne).toHaveBeenCalledWith({ name: mockUserGroup.name }, { relations: ['users'] });
      expect(mockUserGroup.users.includes(mockUser)).toBeFalsy();
      expect(mockUserGroupRepository.save).toHaveBeenCalledWith(mockUserGroup);
      expect(result).toEqual(mockUserGroup);
    });
  });

  describe('exitUserGroup', () => {
    const token = 'validToken';
    it('should return an error if the token is invalid', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.exitUserGroup('invalidToken', 'groupName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Invalid token');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user does not exist', async () => {
      const userPayload = { email: 'test@test.com' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.exitUserGroup(token, 'groupName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User not found');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user group does not exist', async () => {
      const userPayload = { email: 'test@test.com' };
      const user = new User();
      user.email = userPayload.email;
      user.userGroups = [];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.exitUserGroup(token, 'groupName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User group not found');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user is not part of the user group', async () => {
      const userPayload = { email: 'test@test.com' };
      const user = new User();
      user.email = userPayload.email;
      user.userGroups = [];
      const userGroup = new UserGroup();
      userGroup.name = 'groupName';
      userGroup.users = [];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
      const result = await userOrganisationMangementService.exitUserGroup(token, 'groupName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User is not part of the specified user group');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if user is the last admin in the admin group', async () => {
      const userPayload = { email: 'test@test.com' };
      const user = new User();
      user.email = userPayload.email;
      const userGroup = new UserGroup();
      userGroup.name = 'adminGroup';
      userGroup.users = [user];
      user.userGroups = [userGroup];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
      const result = await userOrganisationMangementService.exitUserGroup(token, 'adminGroup');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Cannot remove the last admin from the admin group');
      expect(result.timestamp).toBeDefined();
    });

    it('should return "success" and updated user if user successfully exited the user group', async () => {
      const userPayload = { email: 'test@test.com' };
      const user = new User();
      user.email = userPayload.email;
      const userGroup = new UserGroup();
      userGroup.name = 'groupName';
      userGroup.users = [user];
      user.userGroups = [userGroup];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
      mockUserRepository.save.mockResolvedValueOnce(user);
      mockUserGroupRepository.save.mockResolvedValueOnce(userGroup);
      mockRedis.set.mockResolvedValueOnce('OK');
      const result = await userOrganisationMangementService.exitUserGroup(token, 'groupName');
      expect(result.status).toEqual('success');
      expect(result.message).toEqual(user);
      expect(result.timestamp).toBeDefined();
    });
  });

});
