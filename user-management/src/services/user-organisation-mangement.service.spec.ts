/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserGroup } from '../entity/userGroup.entity';
import { Organisation } from '../entity/organisation.entity';
import { Repository } from 'typeorm';
import { UserOrganisationMangementService } from './user-organisation-mangement.service';
import { RedisService } from 'nestjs-redis';

describe('UserOrganisationMangementService', () => {
  let userOrganisationMangementService: UserOrganisationMangementService;
  let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;
  let mockUserGroupRepository: jest.Mocked<Partial<Repository<UserGroup>>>;
  let mockOrganisationRepository: jest.Mocked<Partial<Repository<Organisation>>>;

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
          provide: RedisService, // Provide the mock redis service
          useValue: RedisService,
        },
      ],
    }).compile();

    userOrganisationMangementService = module.get<UserOrganisationMangementService>(UserOrganisationMangementService);
    mockUserRepository = module.get(getRepositoryToken(User));
    mockUserGroupRepository = module.get(getRepositoryToken(UserGroup));
    mockOrganisationRepository = module.get(getRepositoryToken(Organisation));
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
      const result = await userOrganisationMangementService.addUserToUserGroup(mockBearerToken,mockUser.email, mockUserGroup.name);
  
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
