/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import { Repository } from 'typeorm';
import { UserUserGroupMangementService } from './user-userGroup-management.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

describe('UserUserGroupMangementService', () => {
    let userOrganisationMangementService: UserUserGroupMangementService;
    let mockUserRepository: jest.Mocked<Partial<Repository<User>>>;
    let mockUserGroupRepository: jest.Mocked<Partial<Repository<UserGroup>>>;
    let mockOrganisationRepository: jest.Mocked<Partial<Repository<Organisation>>>;
    let mockRedis: jest.Mocked<Redis>;

    const mockUser = new User();
    const mockUserGroup = new UserGroup();
    const mockOrganisation = new Organisation();
    const mockSendRegistrationEmail = jest.fn();
    const mockSendInvitationEmail = jest.fn();
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
                UserUserGroupMangementService,
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

        userOrganisationMangementService = module.get<UserUserGroupMangementService>(UserUserGroupMangementService);
        mockUserRepository = module.get(getRepositoryToken(User));
        mockUserGroupRepository = module.get(getRepositoryToken(UserGroup));
        mockOrganisationRepository = module.get(getRepositoryToken(Organisation));
        UserUserGroupMangementService.prototype.sendRegistrationEmail = mockSendRegistrationEmail;
        UserUserGroupMangementService.prototype.sendInvitationEmail = mockSendInvitationEmail;
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

            //Mocks  setup 
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
            mockOrganisationRepository.findOne.mockResolvedValueOnce(mockOrganisation);
            mockUserGroupRepository.save.mockResolvedValueOnce(userGroup);

            //Call function
            const result = await userOrganisationMangementService.createUserGroup(token, name, permission);

            //Expected results
            expect(result.status).toEqual('success');
            if (isUserGroup(result.message)) {
                expect(result.message.name).toEqual(name);
                expect(result.message.permission).toEqual(permission);
            } else {
                expect(JSON.parse(result.message).name).toEqual(name);
                expect(JSON.parse(result.message).permission).toEqual(permission);
            }
            expect(result.timestamp).toBeDefined();
        });

        function isUserGroup(obj: any): obj is UserGroup {
            return !!obj && 'name' in obj;
        }
    });

    describe('addUserToUserGroup', () => {
        const token = 'validToken';
        it('should return an error if the token is invalid', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            const result = await userOrganisationMangementService.addUserToUserGroup('invalidToken', 'userEmail', 'groupName');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('Invalid token');
            expect(result.timestamp).toBeDefined();
        });

        it('should return an error if the user group does not exist', async () => {
            const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 1 }] };
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
            mockUserGroupRepository.findOne.mockResolvedValueOnce(null);
            const result = await userOrganisationMangementService.addUserToUserGroup(token, 'userEmail', 'groupName');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('This user group does not exist, please create one');
            expect(result.timestamp).toBeDefined();
        });

        it('should return "success" and message if user does not exist, registration link is sent', async () => {
            const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 1 }] };
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
            mockUserRepository.findOne.mockResolvedValueOnce(null);
            const userGroup = new UserGroup();
            userGroup.name = 'groupName';
            mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
            const result = await userOrganisationMangementService.addUserToUserGroup(token, 'userEmail', 'groupName');
            expect(result.status).toEqual('success');
            expect(result.message).toEqual('Invitation register email successful.');
            expect(result.timestamp).toBeDefined();
        });

        it('should return "success" and message if user exists and invitation link is sent', async () => {
            const userPayload = { organisation: { id: 1 }, userGroups: [{ permission: 1 }] };
            const userToFind = new User();
            userToFind.email = 'userEmail';
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(userPayload));
            mockUserRepository.findOne.mockResolvedValueOnce(userToFind);
            const userGroup = new UserGroup();
            userGroup.name = 'groupName';
            mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
            const result = await userOrganisationMangementService.addUserToUserGroup(token, 'userEmail', 'groupName');
            expect(result.status).toEqual('success');
            expect(result.message).toEqual('Invitation email successful.');
            expect(result.timestamp).toBeDefined();
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

    describe('addUserToUserGroupWithKey', () => {
        const token = 'validToken';
        it('should return an error if the key is invalid', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            const result = await userOrganisationMangementService.addUserToUserGroupWithKey('invalidToken', 'key');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('Invalid user group key');
            expect(result.timestamp).toBeDefined();
        });

        it('should return an error if the user does not exist', async () => {
            const redisData = { userEmail: 'userEmail', userGroupName: 'groupName' };
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(redisData));
            mockUserRepository.findOne.mockResolvedValueOnce(null);
            const result = await userOrganisationMangementService.addUserToUserGroupWithKey(token, 'key');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('User not found');
            expect(result.timestamp).toBeDefined();
        });

        it('should return an error if the user group does not exist', async () => {
            const redisData = { userEmail: 'userEmail', userGroupName: 'groupName' };
            const user = new User();
            user.email = 'userEmail';
            user.userGroups = [];
            user.organisation = new Organisation();
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(redisData));
            mockUserRepository.findOne.mockResolvedValueOnce(user);
            mockUserGroupRepository.findOne.mockResolvedValueOnce(null);
            const result = await userOrganisationMangementService.addUserToUserGroupWithKey(token, 'key');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('User group not found');
            expect(result.timestamp).toBeDefined();
        });

        it('should return an error if the user is already part of the user group', async () => {
            const redisData = { userEmail: 'userEmail', userGroupName: 'groupName' };
            const user = new User();
            user.email = 'userEmail';
            const userGroup = new UserGroup();
            userGroup.id = 1;
            user.userGroups = [userGroup];
            user.organisation = new Organisation();
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(redisData));
            mockUserRepository.findOne.mockResolvedValueOnce(user);
            mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
            const result = await userOrganisationMangementService.addUserToUserGroupWithKey(token, 'key');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual('User is already part of this user group');
            expect(result.timestamp).toBeDefined();
        });

        it('should return an error if the user organisation and the user group organisation do not match', async () => {
            const redisData = { userEmail: 'userEmail', userGroupName: 'groupName' };
            const user = new User();
            user.email = 'userEmail';
            const userGroup = new UserGroup();
            userGroup.id = 1;
            userGroup.organisation = new Organisation();
            userGroup.organisation.id = 2;
            user.userGroups = [];
            user.organisation = new Organisation();
            user.organisation.id = 1;
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(redisData));
            mockUserRepository.findOne.mockResolvedValueOnce(user);
            mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
            const result = await userOrganisationMangementService.addUserToUserGroupWithKey(token, 'key');
            expect(result.status).toEqual(400);
            expect(result.message).toEqual("User's organisation is different from the group's organisation");
            expect(result.timestamp).toBeDefined();
        });

        it('should return "success" and user object if user is added to the group', async () => {
            const redisData = { userEmail: 'userEmail', userGroupName: 'groupName' };
            const user = new User();
            user.email = 'userEmail';
            const userGroup = new UserGroup();
            userGroup.id = 1;
            userGroup.users = []; // Initialize users array
            userGroup.organisation = new Organisation();
            userGroup.organisation.id = 1;
            user.userGroups = [];
            user.organisation = new Organisation();
            user.organisation.id = 1;
            mockRedis.get.mockResolvedValueOnce(JSON.stringify(redisData));
            mockUserRepository.findOne.mockResolvedValueOnce(user);
            mockUserGroupRepository.findOne.mockResolvedValueOnce(userGroup);
            const result = await userOrganisationMangementService.addUserToUserGroupWithKey(token, 'key');
            expect(result.status).toEqual('success');
            expect(result.timestamp).toBeDefined();
        });

    });
});