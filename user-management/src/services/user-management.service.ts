/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from 'src/entity/userGroup.entity';
import { Organisation } from 'src/entity/organisation.entity';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
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
        const { email: userEmail } = JSON.parse(userPayload);
        console.log(userEmail);
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
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

    async createUserGroup(token: string, name: string, permission: number): Promise<UserGroup> {
        // Get organizationId and the userPermission from Redis using token
        const userPayload = await this.redis.get(token);
        const user = JSON.parse(userPayload);
        const organisationId = user.organisationId;
        const userPermission = user.userGroups[0].permission;

        if (userPermission == 1) {
            const existingOrganisation = await this.organisationRepository.findOne({ where: { id: organisationId } });
            if (!existingOrganisation) {
                throw new ConflictException('Organisation does not exist please create one');
            } else {
                const userGroup = new UserGroup();
                userGroup.name = name;
                userGroup.organisation = existingOrganisation;
                userGroup.permission = permission;

                // Save the user group
                await this.userGroupRepository.save(userGroup);

                return userGroup;
            }
        } else {
            throw new ConflictException('User does not have the permissions to do so');
        }
    }

    async addUserToUserGroup(token: string, userEmail: string, userGroupName: string, userAddedPermission: number) {
        // Get organizationId from Redis using token
        const userPayload = await this.redis.get(token);
        const user = JSON.parse(userPayload);
        const organisationId = user.organisationId;
        const userPermission = user.userGroups[0].permission;

        if (userPermission == 1 || userPermission == 2) {
            // Find user group by name and organizationId
            const userGroup = await this.userGroupRepository.findOne({ where: { organisationId: organisationId, name: userGroupName } });
            if (!userGroup) {
                throw new ConflictException("This user group does not exist, please create one");
            } else {
                if (!user) {
                    const key = uuidv4();
                    // Send email to non-existing user with registration link
                    const registerData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName, userPermission: userAddedPermission });
                    await this.redis.set(key, JSON.stringify(registerData), 'EX', 7 * 24 * 60 * 60);
                    await this.sendRegistrationEmail(userEmail, key);
                } else {
                    // Generate random key
                    const key = uuidv4();

                    // Store the key in Redis with 7 days expiry time
                    const redisData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName, userPermission: userAddedPermission });
                    await this.redis.set(key, redisData, 'EX', 7 * 24 * 60 * 60);

                    // Send email to existing user with invitation link
                    await this.sendInvitationEmail(userEmail, key, userGroupName);
                }
            }
        }
    }

    async sendRegistrationEmail(email: string, token: string) {
        // Create a Nodemailer transporter using Google's SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-google-app-password'
            }
        });

        // Email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Registration Confirmation',
            text: `Thank you for registering! Please confirm your email by clicking on the following link: 
            \nhttp://your-app-url/confirm/${token}`
        };

        // Sending the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async sendInvitationEmail(email: string, token: string, userGroupName: string) {
        // Create a Nodemailer transporter using Google's SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-google-app-password'
            }
        });

        // Email options
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Invitation to Join User Group',
            text: `You have been invited to join the user group ${userGroupName}. Please confirm your invitation by clicking on the following link: 
            \nhttp://your-app-url/join/${token}`
        };

        // Sending the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async exitUserGroup(token: string, userGroupName: string) {
        console.log(token + " " + userGroupName);
        return null;
    }

    async removeUserFromUserGroup(token: string, userGroupName: string, userEmail: string) {
        console.log(token + " " + userGroupName);
        return null;
    }

}

