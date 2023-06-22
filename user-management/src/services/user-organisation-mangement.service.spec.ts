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
    it('should create a user group', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
      mockOrganisationRepository.findOne.mockResolvedValueOnce(mockOrganisation);
      mockUserGroupRepository.create.mockReturnValueOnce(mockUserGroup);
      mockUserGroupRepository.save.mockResolvedValueOnce(mockUserGroup);

      const result = await userOrganisationMangementService.createUserGroup('testUserGroup', mockUser.email, mockOrganisation.id);

      expect(mockUserGroupRepository.create).toHaveBeenCalledWith({ name: 'testUserGroup', creator: mockUser, organisation: mockOrganisation });
      expect(mockUserGroupRepository.save).toHaveBeenCalledWith(mockUserGroup);
      expect(result).toEqual(mockUserGroup);
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
    const mockBearerToken = `Bearer mockToken`;

    it('should handle invalid token', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup');
      expect(result).toEqual({
        status: 400, error: true, message: 'Invalid token',
        timestamp: expect.any(String)
      });
    });

    it('should handle insufficient permissions', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        userGroups: [{ permission: 0 }]
      }));
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup');
      expect(result).toEqual({
        status: 400, error: true, message: 'User does not have sufficient permissions',
        timestamp: expect.any(String)
      });
    });

    it('should handle user group not found', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        userGroups: [{ permission: 1 }]
      }));
      mockUserGroupRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup');
      expect(result).toEqual({
        status: 400, error: true, message: 'User group not found',
        timestamp: expect.any(String)
      });
    });

    it('should handle user to be removed not found', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        userGroups: [{ permission: 1 }]
      }));
      mockUserGroupRepository.findOne.mockResolvedValueOnce(new UserGroup());
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup');
      expect(result).toEqual({
        status: 400, error: true, message: 'User to be removed not found',
        timestamp: expect.any(String)
      });
    });

    it('should handle user not part of specified group', async () => {
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        userGroups: [{ permission: 1 }]
      }));
      const userGroup = new UserGroup();
      userGroup.id = 1;
      const user = new User();
      user.userGroups = [];
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup');
      expect(result).toEqual({
        status: 400, error: true, message: 'User to be removed is not part of the specified user group',
        timestamp: expect.any(String)
      });
    });
    it('should remove a user from a user group', async () => {
      const userGroup = new UserGroup();
      userGroup.id = 1;
      userGroup.name = 'testgroup';
      userGroup.users = [new User()];
  
      const user = new User();
      user.email = 'testemail@gmail.com';
      user.userGroups = [userGroup];
  
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        userGroups: [{ permission: 1 }]
      }));
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
      mockUserRepository.findOne.mockResolvedValueOnce(user);
  
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup');
      
      expect(result).toEqual({
        status: 'success', 
        message: userGroup,
        timestamp: expect.any(String)
      });
    });
  
    it('should remove a user from a user group while user is in multiple groups', async () => {
      const userGroup1 = new UserGroup();
      userGroup1.id = 1;
      userGroup1.name = 'testgroup1';
      userGroup1.users = [new User()];
  
      const userGroup2 = new UserGroup();
      userGroup2.id = 2;
      userGroup2.name = 'testgroup2';
      userGroup2.users = [new User(), new User()];
  
      const user = new User();
      user.email = 'testemail@gmail.com';
      user.userGroups = [userGroup1, userGroup2];
  
      mockRedis.get.mockResolvedValueOnce(JSON.stringify({
        userGroups: [{ permission: 1 }]
      }));
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup1);
      mockUserRepository.findOne.mockResolvedValueOnce(user);
  
      const result = await userOrganisationMangementService.removeUserFromUserGroup(mockBearerToken, 'testemail@gmail.com', 'testgroup1');
      
      expect(result).toEqual({
        status: 'success', 
        message: userGroup1,
        timestamp: expect.any(String)
      });
    });
  });

  describe('exitUserGroup', () => {
    it('should delete a user group', async () => {
      const mockBearerToken = `Bearer mockToken`;
      mockUserGroupRepository.findOne.mockResolvedValueOnce(mockUserGroup);
      mockUserGroupRepository.remove.mockResolvedValueOnce(mockUserGroup);
      const result = await userOrganisationMangementService.exitUserGroup(mockBearerToken, mockUserGroup.name);

      expect(mockUserGroupRepository.findOne).toHaveBeenCalledWith({ name: mockUserGroup.name });
      expect(mockUserGroupRepository.remove).toHaveBeenCalledWith(mockUserGroup);
      expect(result).toEqual({ success: true });
    });
  });
});
