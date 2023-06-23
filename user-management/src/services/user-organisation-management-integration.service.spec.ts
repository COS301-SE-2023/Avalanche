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
  });

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
      user.organisation = new Organisation();
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
      expect(result.status).toBe(400);
      expect(result.message).toBe('User already belongs to an organisation');
  }, 10000);                    
  });

  // afterEach(async () => {
  //   // Delete everything from Redis
  //   const keys = await redis.keys('*');
  //   if (keys.length > 0) {
  //     await redis.del(keys);
  //   }
  
  //   // Delete everything from the database
  //   await userRepository.clear();
  // await userGroupRepository.clear();
  // await organisationRepository.clear();
    
  // });

  afterAll(async () => {
    await appModule.close(); // Make sure you close the connection to the database
  });
});

function generateRandomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
