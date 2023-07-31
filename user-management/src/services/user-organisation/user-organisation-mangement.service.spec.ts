/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
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
  jest.mock('uuid', () => ({
    v4: jest.fn(),
  }));

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
      find: jest.fn(),
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

  describe('getMembers', () => {
    it('should return an error if the token is invalid', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.getMembers('invalidToken');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Invalid token.');
      expect(result.timestamp).toBeDefined();
    });
  
    it('should return an error if the user does not exist', async () => {
      const userPayload = { email: 'userEmail' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.getMembers('validToken');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User does not exist.');
      expect(result.timestamp).toBeDefined();
    });
  
    it('should return user group information if the token and user are valid', async () => {
      const userPayload = { email: 'userEmail' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
  
      const groupMember1 = new User();
      groupMember1.firstName = 'Member1First';
      groupMember1.lastName = 'Member1Last';
      groupMember1.email = 'member1@email.com';
  
      const groupMember2 = new User();
      groupMember2.firstName = 'Member2First';
      groupMember2.lastName = 'Member2Last';
      groupMember2.email = 'member2@email.com';
  
      const userGroup = new UserGroup();
      userGroup.name = 'TestGroup';
      userGroup.users = [groupMember1, groupMember2];
      userGroup.id = 1;
  
      const user = new User();
      user.email = 'userEmail';
      user.userGroups = [userGroup];
  
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
  
      const result = await userOrganisationMangementService.getMembers('validToken');
      expect(result.status).toEqual('success');
      expect(result.users[0].userGroupName).toEqual(userGroup.name);
      expect(result.users[0].userGroupID).toEqual(userGroup.id);
      expect(result.users[0].groupMembers).toEqual([
        {
          firstName: groupMember1.firstName,
          lastName: groupMember1.lastName,
          email: groupMember1.email
        },
        {
          firstName: groupMember2.firstName,
          lastName: groupMember2.lastName,
          email: groupMember2.email
        }
      ]);
      expect(result.timestamp).toBeDefined();
    });

    it('should return information from multiple groups if the user belongs to multiple groups', async () => {
      const userPayload = { email: 'userEmail' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
    
      const groupMember1 = new User();
      groupMember1.firstName = 'Member1First';
      groupMember1.lastName = 'Member1Last';
      groupMember1.email = 'member1@email.com';
    
      const userGroup1 = new UserGroup();
      userGroup1.name = 'TestGroup1';
      userGroup1.users = [groupMember1];
      userGroup1.id = 1;
    
      const groupMember2 = new User();
      groupMember2.firstName = 'Member2First';
      groupMember2.lastName = 'Member2Last';
      groupMember2.email = 'member2@email.com';
    
      const userGroup2 = new UserGroup();
      userGroup2.name = 'TestGroup2';
      userGroup2.users = [groupMember2];
      userGroup2.id = 2;
    
      const user = new User();
      user.email = 'userEmail';
      user.userGroups = [userGroup1, userGroup2];
    
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(mockUserGroupRepository, 'findOne').mockResolvedValue(userGroup1);
      jest.spyOn(mockUserGroupRepository, 'findOne').mockResolvedValue(userGroup2);
    
      const result = await userOrganisationMangementService.getMembers('validToken');
      expect(result.status).toEqual('success');
      expect(result.users.length).toEqual(4);
      expect(result.users[0].userGroupName).toEqual(userGroup1.name);
      expect(result.users[0].userGroupID).toEqual(userGroup1.id);
      expect(result.users[1].userGroupName).toEqual(userGroup2.name);
      expect(result.users[1].userGroupID).toEqual(userGroup2.id);
      expect(result.timestamp).toBeDefined();
    });    

    it('should return group member information according to userGroup permission', async () => {
      const userPayload = { email: 'userEmail' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
    
      const groupMember1 = new User();
      groupMember1.firstName = 'Member1First';
      groupMember1.lastName = 'Member1Last';
      groupMember1.email = 'member1@email.com';
    
      const userGroup = new UserGroup();
      userGroup.name = 'TestGroup';
      userGroup.users = [groupMember1];
      userGroup.id = 1;
      userGroup.permission = 2; // Set to test different permission levels
    
      const user = new User();
      user.email = 'userEmail';
      user.userGroups = [userGroup];
    
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      jest.spyOn(mockUserGroupRepository, 'findOne').mockResolvedValue(userGroup);
    
      const result = await userOrganisationMangementService.getMembers('validToken');
      expect(result.status).toEqual('success');
      expect(result.users[0].userGroupName).toEqual(userGroup.name);
      expect(result.users[0].userGroupID).toEqual(userGroup.id);
      expect(result.timestamp).toBeDefined();
    });
    
  });  

  describe('createOrganisation', () => {
    const token = 'validToken';
    it('should return an error if the token is invalid', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.createOrganisation('invalidToken', 'orgName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Invalid token.');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user does not exist', async () => {
      const userPayload = { email: 'userEmail' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.createOrganisation(token, 'orgName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User does not exist.');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user already belongs to an organisation', async () => {
      const userPayload = { email: 'userEmail' };
      const user = new User();
      user.organisation = new Organisation();
      user.organisation.id = 1;
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      const result = await userOrganisationMangementService.createOrganisation(token, 'orgName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User already belongs to an organisation');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the organisation name is already taken', async () => {
      const userPayload = { email: 'userEmail' };
      const user = new User();
      user.organisation = null;
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockOrganisationRepository.findOne.mockResolvedValueOnce(new Organisation());
      const result = await userOrganisationMangementService.createOrganisation(token, 'orgName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Organisation with this name already exists');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the organisation name length is zero', async () => {
      const userPayload = { email: 'userEmail' };
      const user = new User();
      user.organisation = null;
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockOrganisationRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.createOrganisation(token, '');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Please enter an organisation with charceters and a length greater than 0');
      expect(result.timestamp).toBeDefined();
    });

    it('should return "success" and user object if organisation is created', async () => {
      const userPayload = { email: 'userEmail' };
      const user = new User();
      user.organisation = null;  // user is not part of an organisation yet
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockOrganisationRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.createOrganisation(token, 'orgName');
      expect(result.status).toEqual('success');
      expect(result.message).toEqual(user);
      expect(result.timestamp).toBeDefined();
    });
  });


  describe('exitOrganisation', () => {
    const token = 'validToken';
    it('should return an error if the token is invalid', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.exitOrganisation('invalidToken', 'organisationName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Invalid token');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user does not exist', async () => {
      const userPayload = { email: 'email@example.com' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.exitOrganisation(token, 'organisationName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User to be removed not found');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the organisation does not exist', async () => {
      const userPayload = { email: 'email@example.com' };
      const user = new User();
      user.email = 'email@example.com';
      user.userGroups = [];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockOrganisationRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.exitOrganisation(token, 'organisationName');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Organisation cannot be found');
      expect(result.timestamp).toBeDefined();
    });

    it('should return "success" and user object if user successfully exits organisation and user groups', async () => {
      const userPayload = { email: 'email@example.com' };
      const user = new User();
      user.email = 'email@example.com';
      user.userGroups = [new UserGroup()];
      user.userGroups[0].users = [user];  // Ensure users array is not undefined
      const organisation = new Organisation();
      organisation.name = 'organisationName';
      organisation.users = [user];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockOrganisationRepository.findOne.mockResolvedValueOnce(organisation);
      const result = await userOrganisationMangementService.exitOrganisation(token, 'organisationName');
      expect(result.status).toEqual('success');
      expect(result.timestamp).toBeDefined();
    });

  });

  describe('removeUserFromOrganisation', () => {
    const token = 'validToken';
    it('should return an error if the token is invalid', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.removeUserFromOrganisation('invalidToken', 'organisationName', 'email@example.com');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('Invalid token');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user does not have sufficient permissions', async () => {
      const userPayload = { userGroups: [{ permission: 0 }] };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      const result = await userOrganisationMangementService.removeUserFromOrganisation(token, 'organisationName', 'email@example.com');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User does not have sufficient permissions');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the organisation does not exist', async () => {
      const userPayload = { userGroups: [{ permission: 1 }] };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockOrganisationRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.removeUserFromOrganisation(token, 'organisationName', 'email@example.com');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User group not found');
      expect(result.timestamp).toBeDefined();
    });

    it('should return an error if the user to be removed does not exist', async () => {
      const userPayload = { userGroups: [{ permission: 1 }] };
      const organisation = new Organisation();
      organisation.name = 'organisationName';
      organisation.users = [];
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockOrganisationRepository.findOne.mockResolvedValueOnce(organisation);
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const result = await userOrganisationMangementService.removeUserFromOrganisation(token, 'organisationName', 'email@example.com');
      expect(result.status).toEqual(400);
      expect(result.message).toEqual('User to be removed not found');
      expect(result.timestamp).toBeDefined();
    });

    it('should return "success" if user successfully removed from organisation and user groups', async () => {
      const userPayload = { userGroups: [{ permission: 1 }] };
      const organisation = new Organisation();
      organisation.name = 'organisationName';
      organisation.users = [];
      const userGroup = new UserGroup();
      userGroup.users = [];
      const user = new User();
      user.email = 'email@example.com';
      user.userGroups = [userGroup];
      user.id = 1;
      userGroup.users.push(user);
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
      mockOrganisationRepository.findOne.mockResolvedValueOnce(organisation);
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      const result = await userOrganisationMangementService.removeUserFromOrganisation(token, 'organisationName', 'email@example.com');
      expect(result.status).toEqual('success');
      expect(result.message).toEqual('User removed from organisation and user groups');
      expect(result.timestamp).toBeDefined();
    });
  });



});
