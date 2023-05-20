/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from 'src/entity/userGroup.entity';
import { Organisation } from 'src/entity/organisation.entity';
@Injectable()
export class UserService {
    constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>) { }

    async createOrganisation(token: string, name: string): Promise<Organisation> {
        // Extract the JWT token
        // Retrieve the user's information from Redis using the token
        const userPayload = await this.redis.get(token); 
        const {email: userEmail} = JSON.parse(userPayload);
        console.log(userEmail);
        const user = await this.userRepository.findOne({where : {email: userEmail}});
        console.log(user); 
        // Check if the user already belongs to an organisation
        if (user.organisationId) {
            throw new ConflictException('User already belongs to an organisation');
            return 
        }

        // Check if the organisation name is already taken
        const existingOrganisation = await this.organisationRepository.findOne({ where: { name: name } });
        if (existingOrganisation) {
            throw new ConflictException('Organisation with this name already exists');
        }

        // Create the organisation
        const organisation = this.organisationRepository.create({ name: name });
        await this.organisationRepository.save(organisation);


        // Create a new user group for this organisation
        const userGroup = new UserGroup();
        userGroup.name = `admin-${organisation.name}`;
        userGroup.organisation = organisation;
        userGroup.permission = 1;

        await this.userGroupRepository.save(userGroup);

        // Assign the user to this organisation and user group
        user.organisation = organisation;
        user.userGroups = [userGroup];
        console.log(user);
        await this.userRepository.save(user);


        // Update the user's information in Redis
        await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);

        return organisation;
    }

}

