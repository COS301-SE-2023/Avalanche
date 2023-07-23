/* eslint-disable prettier/prettier */
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { Organisation } from '../../entity/organisation.entity';
import { User } from '../../entity/user.entity';
import { Random } from 'mockjs';
import { UserGroup } from '../../entity/userGroup.entity';
import { UserUserGroupMangementService } from './user-userGroup-management.service';
import * as jwt from 'jsonwebtoken';

describe('UserUserGroupMangementService Integration', () => {

  const serializeUser = (user) => {
    return {
      ...user,
      userGroups: user.userGroups ? user.userGroups.map(userGroup => ({
        ...userGroup,
        users: undefined, // removing users to prevent circular structure
      })) : [],
      organisation: user.organisation ? {
        ...user.organisation,
        users: undefined, // removing users to prevent circular structure
      } : null,
    };
  };

  let appModule: TestingModule;
  let userOrganisationMangementService: UserUserGroupMangementService;
  let userRepository;
  let userGroupRepository;
  let organisationRepository;
  let redis;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userOrganisationMangementService =
      appModule.get<UserUserGroupMangementService>(
        UserUserGroupMangementService,
      );
    userRepository = appModule.get(getRepositoryToken(User));
    userGroupRepository = appModule.get(getRepositoryToken(UserGroup));
    organisationRepository = appModule.get(getRepositoryToken(Organisation));
    redis = appModule.get('REDIS');
  }, 15000);
describe('createUserGroup', () => {
    const serializeUser = (user) => {
      return {
        ...user,
        organisation: user.organisation ? {
          ...user.organisation,
        } : null,
        userGroups: user.userGroups ? user.userGroups.map(userGroup => ({
          ...userGroup,
        })) : [],
      };
    };
    it('should create a new user group if user has permission', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const org = new Organisation();
      org.name = Random.word(5);  // Set name here
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      const name = Random.word(5);
      const permission = 2;

      // Act
      const result = await userOrganisationMangementService.createUserGroup(
        jwtToken,
        name,
        permission,
      );

      // Assert
      expect(result.status).toBe('success');
    }, 20000);

    it('should return an error if token is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(20);
      const name = Random.word(10);
      const permission = 2;

      // Act
      const result = await userOrganisationMangementService.createUserGroup(
        jwtToken,
        name,
        permission,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token');
    }, 10000);

    it('should return an error if user does not exist', async () => {
      // Arrange
      const email = Random.email();
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);

      const name = Random.word(10);
      const permission = 2;

      // Act
      const result = await userOrganisationMangementService.createUserGroup(
        jwtToken,
        name,
        permission,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token');
    }, 10000);

    it('should return an error if user does not have the permissions to do so', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const org = new Organisation();
      org.name = Random.word(5);  // Set name here
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 0;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);

      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      const name = Random.word(5);
      const permission = 2;

      // Act
      const result = await userOrganisationMangementService.createUserGroup(
        jwtToken,
        name,
        permission,
      );

      // Assert
      expect(result.status).toBe('failure');
      expect(result.message).toBe('User does not have the permissions to do so');
    }, 10000);
  
    it('should return an error if name.length === 0', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const org = new Organisation();
      org.name = Random.word(5);  // Set name here
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);

      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      const name = '';
      const permission = 2;

      // Act
      const result = await userOrganisationMangementService.createUserGroup(
        jwtToken,
        name,
        permission,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Please enter a user group name with characters and a length greater than zero');
    }, 10000);
  });

  describe('addUserToUserGroup', () => {
    it('should return an error if token is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(20);
      const userEmail = Random.email();
      const userGroupName = Random.word(10);
  
      // Act
      const result = await userOrganisationMangementService.addUserToUserGroup(
        jwtToken,
        userEmail,
        userGroupName,
      );
  
      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token');
    }, 10000);
  
    it('should return an error if user group does not exist', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);
  
      const org = new Organisation();
      org.name = Random.word(5);  // Set name here
      const savedOrg = await organisationRepository.save(org);
  
      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);
  
      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);
  
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
  
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);
  
      const userEmail = Random.email();
      const userGroupName = Random.word(10);
  
      // Act
      const result = await userOrganisationMangementService.addUserToUserGroup(
        jwtToken,
        userEmail,
        userGroupName,
      );
  
      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('This user group does not exist, please create one');
    }, 20000);
  
    it('should return success and send registration email if user does not exist', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);
  
      const org = new Organisation();
      org.name = Random.word(5);  // Set name here
      const savedOrg = await organisationRepository.save(org);
  
      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);
  
      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);
  
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
  
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);
  
      const userEmail = Random.email();
      const userGroupName = savedUserGroup.name;
  
      // Act
      const result = await userOrganisationMangementService.addUserToUserGroup(
        jwtToken,
        userEmail,
        userGroupName,
      );
  
      // Assert
      // Check response
      expect(result.status).toBe('success');
      expect(result.message).toBe('Invitation register email successful.');
  
    }, 20000);
  
    it('should return success and send invitation email if user exists', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);
  
      const org = new Organisation();
      org.name = Random.word(5);  // Set name here
      const savedOrg = await organisationRepository.save(org);
  
      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);
  
      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);
  
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
  
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);
  
      const userEmail = Random.email();
      const userToAdd = new User();
      userToAdd.email = userEmail;
      userToAdd.password = password;
      userToAdd.organisation = savedOrg;
      await userRepository.save(userToAdd);
  
      const userGroupName = savedUserGroup.name;
  
      // Act
      const result = await userOrganisationMangementService.addUserToUserGroup(
        jwtToken,
        userEmail,
        userGroupName,
      );
  
      // Assert
      // Check response
      expect(result.status).toBe('success');
      expect(result.message).toBe('Invitation email successful.');
  
    }, 20000);
  });  

  describe('addUserToUserGroupWithKey', () => {
    it('should return an error if Redis key is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(10);
      const key = Random.word(10);

      // Act
      const result = await userOrganisationMangementService.addUserToUserGroupWithKey(
        jwtToken,
        key,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid user group key');
    }, 10000);

    it('should return an error if user does not exist', async () => {
      // Arrange
      const jwtToken = Random.word(10);
      const key = Random.word(10);

      await redis.set(key, JSON.stringify({ userEmail: Random.email(), userGroupName: Random.word(10) }), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.addUserToUserGroupWithKey(
        jwtToken,
        key,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User not found');
    }, 10000);
    it('should return an error if user group does not exist', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.email();
      const user = new User();
      user.email = email;
      user.password = password;
      await userRepository.save(user);

      const jwtToken = Random.word(10);
      const key = Random.word(10);

      await redis.set(jwtToken, JSON.stringify(user), 'EX', 24 * 60 * 60);
      await redis.set(key, JSON.stringify({ userEmail: email, userGroupName: Random.word(10) }), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.addUserToUserGroupWithKey(
        jwtToken,
        key,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User group not found');
    }, 10000);

    it('should return an error if the user is already part of the user group', async () => {
      // Arrange
      const org = new Organisation();
      org.name = Random.word(5);
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.organisation = savedOrg;
      userGroup.permission = 2;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = Random.email();
      user.password = Random.word(8);
      user.organisation = savedOrg;
      const savedUser = await userRepository.save(user);

      await userGroupRepository.createQueryBuilder()
        .relation(UserGroup, 'users')
        .of(savedUserGroup)
        .add(savedUser);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email: user.email }, jwtSecret);

      const key = Random.word(10);
      const redisData = { userEmail: user.email, userGroupName: userGroup.name };
      await redis.set(key, JSON.stringify(redisData), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.addUserToUserGroupWithKey(jwtToken, key);

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User is already part of this user group');
    }, 10000);

    it('should return an error if the user\'s organisation is different from the group\'s organisation', async () => {
      // Arrange
      const org1 = new Organisation();
      org1.name = Random.word(5);
      const savedOrg1 = await organisationRepository.save(org1);

      const org2 = new Organisation();
      org2.name = Random.word(5);
      const savedOrg2 = await organisationRepository.save(org2);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.organisation = savedOrg1;
      userGroup.permission = 2;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = Random.email();
      user.password = Random.word(8);
      user.organisation = savedOrg2;
      const savedUser = await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email: user.email }, jwtSecret);

      const key = Random.word(10);
      const redisData = { userEmail: user.email, userGroupName: userGroup.name };
      await redis.set(key, JSON.stringify(redisData), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.addUserToUserGroupWithKey(jwtToken, key);

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User\'s organisation is different from the group\'s organisation');
    }, 10000);

    it('should add the user to the group if everything is valid', async () => {
      // Arrange
      const org = new Organisation();
      org.name = Random.word(5);
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.organisation = savedOrg;
      userGroup.permission = 2;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = Random.email();
      user.password = Random.word(8);
      user.organisation = savedOrg;
      const savedUser = await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email: user.email }, jwtSecret);

      const key = Random.word(10);
      const redisData = { userEmail: user.email, userGroupName: userGroup.name };
      await redis.set(key, JSON.stringify(redisData), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.addUserToUserGroupWithKey(jwtToken, key);

      // Assert
      expect(result.status).toBe("success");
      if (isUser(result.message)) {
        expect(result.message.email).toBe(user.email);
        expect(result.message.organisation.name).toBe(savedOrg.name);
        expect(result.message.userGroups.length).toBeGreaterThan(0);
      }

    }, 10000);

    function isUser(obj: any): obj is User {
      return !!obj && 'email' in obj && 'id' in obj;
    }



  });

  describe('exitUserGroup', () => {
    it('should allow user to exit a user group', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const org = new Organisation();
      org.name = Random.word(5);
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.exitUserGroup(jwtToken, savedUserGroup.name);

      // Assert
      expect(result.status).toBe('success');
    }, 20000);

    it('should not allow the last admin to exit the admin group', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const org = new Organisation();
      org.name = Random.word(5);
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = "admin-" + Random.word(5);
      userGroup.permission = 1;
      userGroup.organisation = savedOrg;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.exitUserGroup(jwtToken, savedUserGroup.name);

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Cannot remove the last admin from the admin group');
    }, 20000);
    
  });

  describe('removeUserFromUserGroup', () => {

    it('should remove a user from a user group if the invoker has permissions', async () => {
      // Arrange
      const invokerEmail = Random.email();
      const userToBeRemovedEmail = Random.email();
      const invokerPassword = Random.word(8);
      const userToBeRemovedPassword = Random.word(8);
      const org = new Organisation();
      org.name = Random.word(5);
      const savedOrg = await organisationRepository.save(org);

      const invokerGroup = new UserGroup();
      invokerGroup.name = Random.word(5);
      invokerGroup.permission = 1;
      invokerGroup.organisation = savedOrg;
      const savedInvokerGroup = await userGroupRepository.save(invokerGroup);

      const userToBeRemovedGroup = new UserGroup();
      userToBeRemovedGroup.name = Random.word(5);
      userToBeRemovedGroup.permission = 0;
      userToBeRemovedGroup.organisation = savedOrg;
      const savedUserToBeRemovedGroup = await userGroupRepository.save(userToBeRemovedGroup);

      const invoker = new User();
      invoker.email = invokerEmail;
      invoker.password = invokerPassword;
      invoker.organisation = savedOrg;
      invoker.userGroups = [savedInvokerGroup];
      await userRepository.save(invoker);

      const userToBeRemoved = new User();
      userToBeRemoved.email = userToBeRemovedEmail;
      userToBeRemoved.password = userToBeRemovedPassword;
      userToBeRemoved.organisation = savedOrg;
      userToBeRemoved.userGroups = [savedUserToBeRemovedGroup];
      await userRepository.save(userToBeRemoved);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email: invokerEmail }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(invoker)), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.removeUserFromUserGroup(
        jwtToken,
        savedUserToBeRemovedGroup.name,
        userToBeRemovedEmail,
      );

      // Assert
      expect(result.status).toBe('success');
    }, 20000);

    it('should return an error if token is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(20);
      const userGroupName = Random.word(10);
      const userEmail = Random.email();

      // Act
      const result = await userOrganisationMangementService.removeUserFromUserGroup(
        jwtToken,
        userGroupName,
        userEmail,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.error).toBeTruthy();
      expect(result.message).toBe('Invalid token');
    }, 10000);

    it('should return an error if invoker does not have sufficient permissions', async () => {
      // Arrange
      const invokerEmail = Random.email();
      const userToBeRemovedEmail = Random.email();
      const invokerPassword = Random.word(8);
      const userToBeRemovedPassword = Random.word(8);
      const org = new Organisation();
      org.name = Random.word(5);
      const savedOrg = await organisationRepository.save(org);

      const invokerGroup = new UserGroup();
      invokerGroup.name = Random.word(5);
      invokerGroup.permission = 3; // Insufficient permission
      invokerGroup.organisation = savedOrg;
      const savedInvokerGroup = await userGroupRepository.save(invokerGroup);

      const userToBeRemovedGroup = new UserGroup();
      userToBeRemovedGroup.name = Random.word(5);
      userToBeRemovedGroup.permission = 1;
      userToBeRemovedGroup.organisation = savedOrg;
      const savedUserToBeRemovedGroup = await userGroupRepository.save(userToBeRemovedGroup);

      const invoker = new User();
      invoker.email = invokerEmail;
      invoker.password = invokerPassword;
      invoker.organisation = savedOrg;
      invoker.userGroups = [savedInvokerGroup];
      await userRepository.save(invoker);

      const userToBeRemoved = new User();
      userToBeRemoved.email = userToBeRemovedEmail;
      userToBeRemoved.password = userToBeRemovedPassword;
      userToBeRemoved.organisation = savedOrg;
      userToBeRemoved.userGroups = [savedUserToBeRemovedGroup];
      await userRepository.save(userToBeRemoved);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email: invokerEmail }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(invoker)), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.removeUserFromUserGroup(
        jwtToken,
        savedUserToBeRemovedGroup.name,
        userToBeRemovedEmail,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.error).toBe(true);
      expect(result.message).toBe("User does not have sufficient permissions");
    }, 20000);


  });
});