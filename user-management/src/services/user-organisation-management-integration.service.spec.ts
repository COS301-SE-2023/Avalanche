/* eslint-disable prettier/prettier */
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { Organisation } from '../entity/organisation.entity';
import { User } from '../entity/user.entity';
import { Random } from 'mockjs';
import { UserGroup } from '../entity/userGroup.entity';
import { UserOrganisationMangementService } from './user-organisation-mangement.service';
import * as jwt from 'jsonwebtoken';

describe('UserOrganisationMangementService Integration', () => {

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
  let userOrganisationMangementService: UserOrganisationMangementService;
  let userRepository;
  let userGroupRepository;
  let organisationRepository;
  let redis;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userOrganisationMangementService =
      appModule.get<UserOrganisationMangementService>(
        UserOrganisationMangementService,
      );
    userRepository = appModule.get(getRepositoryToken(User));
    userGroupRepository = appModule.get(getRepositoryToken(UserGroup));
    organisationRepository = appModule.get(getRepositoryToken(Organisation));
    redis = appModule.get('REDIS');
  }, 15000);

  // Here we test the service without mocking the repositories and Redis service.
  describe('createOrganisation', () => {
    it('should create a new organisation and assign the user to it', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);
      const user = new User();
      user.email = email;
      user.password = password;
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);

      await redis.set(jwtToken, JSON.stringify(user), 'EX', 24 * 60 * 60);

      const name = Random.word(10);

      // Act
      const result = await userOrganisationMangementService.createOrganisation(
        jwtToken,
        name,
      );

      // Assert
      expect(result.status).toBe('success');
      const updatedUser = await userRepository.findOne({
        where: { email: email },
        relations: ['userGroups', 'organisation'],
      });
      expect(updatedUser.organisation.name).toBe(name);
      expect(updatedUser.userGroups[0].name).toBe(`admin-${name}`);
    }, 20000);

    it('should return an error if token is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(20);
      const name = Random.word(10);

      // Act
      const result = await userOrganisationMangementService.createOrganisation(
        jwtToken,
        name,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token.');
    }, 10000);

    it('should return an error if user does not exist', async () => {
      // Arrange
      const email = Random.email();
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);

      await redis.set(jwtToken, JSON.stringify({ email }), 'EX', 24 * 60 * 60);

      const name = Random.word(10);

      // Act
      const result = await userOrganisationMangementService.createOrganisation(
        jwtToken,
        name,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User does not exist.');
    }, 10000);

    it('should return an error if user already belongs to an organisation', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);
      const user = new User();
      user.email = email;
      user.password = password;

      const org = new Organisation();
      // add necessary fields to the org object, if required
      const savedOrg = await organisationRepository.save(org);  // save organisation instance

      user.organisation = savedOrg;  // associate the saved organisation instance
      await userRepository.save(user);  // save user

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);

      await redis.set(jwtToken, JSON.stringify(user), 'EX', 24 * 60 * 60);

      const name = Random.word(10);

      // Act
      const result = await userOrganisationMangementService.createOrganisation(
        jwtToken,
        name,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User already belongs to an organisation');
    }, 10000);
  });

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

    it('should return an error if organisation does not exist', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.permission = 1;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
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
      expect(result.status).toBe(400);
      expect(result.message).toBe('Organisation does not exist please create one');
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

  describe('removeUserFromOrganisation', () => {
    it('should remove a user from an organisation and user groups', async () => {
      // Arrange
      const admin = new User();
      const adminEmail = Random.email();
      admin.email = adminEmail;
      const adminPassword = Random.word(8);
      admin.password = adminPassword;


      const userToRemove = new User();
      const userToRemoveEmail = Random.email();
      userToRemove.email = userToRemoveEmail;
      const userToRemovePassword = Random.word(8);
      userToRemove.password = userToRemovePassword;

      const userGroup = new UserGroup();
      userGroup.name = 'testGroup';
      userGroup.permission = 1;
      userGroup.users = [admin, userToRemove];
      await userGroupRepository.save(userGroup);

      const organisation = new Organisation();
      organisation.name = 'testOrganisation';
      organisation.users = [admin, userToRemove];
      await organisationRepository.save(organisation);

      admin.userGroups = [userGroup];
      userToRemove.userGroups = [userGroup];
      admin.organisation = organisation;
      userToRemove.organisation = organisation;
      await userRepository.save(admin);
      await userRepository.save(userToRemove);

      const token = 'testToken';
      const userToRemoveCopy = Object.assign({}, userToRemove);
      userToRemoveCopy.userGroups = userToRemove.userGroups.map(group => {
        const groupCopy = Object.assign({}, group);
        delete groupCopy.users;
        return groupCopy;
      });
      await redis.set(token, JSON.stringify(serializeUser(userToRemoveCopy)), 'EX', 24 * 60 * 60);


      // Act
      const result = await userOrganisationMangementService.removeUserFromOrganisation(token, 'testOrganisation', userToRemoveEmail);

      // Assert
      expect(result.status).toBe('success');
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

  describe('exitOrganisation', () => {

    it('should remove a user from an organisation and associated user groups', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);
      const organisationName = Random.word(5);

      const org = new Organisation();
      org.name = organisationName;
      const savedOrg = await organisationRepository.save(org);

      const userGroup = new UserGroup();
      userGroup.name = Random.word(5);
      userGroup.organisation = savedOrg;
      userGroup.permission = 2;
      const savedUserGroup = await userGroupRepository.save(userGroup);

      const user = new User();
      user.email = email;
      user.password = password;
      user.organisation = savedOrg;
      user.userGroups = [savedUserGroup];
      user.organisationId = savedOrg.id;
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      // Act
      const result = await userOrganisationMangementService.exitOrganisation(
        jwtToken,
        organisationName,
      );

      // Assert
      expect(result.status).toBe('success');
      if (isMessageUser(result.message)) {
        expect(result.message.text).toBe('User removed from organisation and user groups');
        const removedUser = result.message.user;
        expect(removedUser.organisation).toBeNull();
        expect(removedUser.userGroups).toBeNull();
      }

    }, 20000);
    it('should return an error if token is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(20);
      const organisationName = Random.word(5);

      // Act
      const result = await userOrganisationMangementService.exitOrganisation(
        jwtToken,
        organisationName,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token');
    }, 10000);

    it('valid JWT but not in Redis', async () => {
      // Arrange
      const email = Random.email();
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
      const organisationName = Random.word(5);

      // Act
      const result = await userOrganisationMangementService.exitOrganisation(
        jwtToken,
        organisationName,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token');
    }, 10000);

    it('should return an error if organisation does not exist', async () => {
      // Arrange
      const email = Random.email();
      const password = Random.word(8);

      const user = new User();
      user.email = email;
      user.password = password;
      await userRepository.save(user);

      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
      await redis.set(jwtToken, JSON.stringify(serializeUser(user)), 'EX', 24 * 60 * 60);

      const organisationName = Random.word(5);

      // Act
      const result = await userOrganisationMangementService.exitOrganisation(
        jwtToken,
        organisationName,
      );

      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Organisation cannot be found');
    }, 10000);

    interface MessageUser {
      text: string;
      user: User;
    }
    
    function isMessageUser(obj: any): obj is MessageUser {
      return !!obj && typeof obj === 'object' && 'text' in obj && 'user' in obj;
    }
  });




  // afterEach(async () => {
  //   // Delete everything from Redis
  //   const keys = await redis.keys('*');
  //   if (keys?.length > 0) {
  //     await redis.del(keys);
  //   }

  //   // Delete everything from the database
  //   await userRepository.clear();
  //   await userGroupRepository.clear();
  //   await organisationRepository.clear();

  // });

  afterAll(async () => {
    await appModule.close(); // Make sure you close the connection to the database
  });
});
