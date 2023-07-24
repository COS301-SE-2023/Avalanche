/* eslint-disable prettier/prettier */
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { Organisation } from '../../entity/organisation.entity';
import { User } from '../../entity/user.entity';
import { Random } from 'mockjs';
import { UserGroup } from '../../entity/userGroup.entity';
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

  describe('getMembers', () => {
    it('should return members of a user\'s organisation and user groups', async () => {
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
      const result = await userOrganisationMangementService.getMembers(jwtToken);
  
      // Assert
      expect(result.status).toBe('success');
      expect(result.users.length).toBe(1);
      expect(result.users[0].userGroupName).toBe(savedUserGroup.name);
    }, 20000);
  
    it('should return an error if token is invalid', async () => {
      // Arrange
      const jwtToken = Random.word(20);
  
      // Act
      const result = await userOrganisationMangementService.getMembers(jwtToken);
  
      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid token.');
    }, 10000);
  
    it('valid JWT but not in Redis', async () => {
      // Arrange
      const email = Random.email();
      const jwtSecret = Random.word(10);
      const jwtToken = jwt.sign({ email }, jwtSecret);
  
      // Act
      const result = await userOrganisationMangementService.getMembers(jwtToken);
  
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
  
      // Act
      const result = await userOrganisationMangementService.getMembers(jwtToken);
  
      // Assert
      expect(result.status).toBe(400);
      expect(result.message).toBe('User does not exist.');
    }, 10000);
  });  

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

      const orgName = Random.word(10);
      const org = new Organisation();
      org.name = orgName;
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

  afterAll(async () => {
    await appModule.close(); // Make sure you close the connection to the database
  });
});
