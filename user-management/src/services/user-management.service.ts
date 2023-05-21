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
import { readFileSync } from 'fs';
import { join } from 'path';
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
        user.userGroupId = userGroup.id;
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

    async addUserToUserGroup(token: string, userEmail: string, userGroupName: string) {
        // Get organizationId from Redis using token
        const userPayload = await this.redis.get(token);
        const user = JSON.parse(userPayload);
        const organisationId = user.organisationId;
        const userPermission = user.userGroups[0].permission;

        const userToFind = await this.userRepository.findOne({ where: { email: userEmail } });

        if (userPermission == 1 || userPermission == 2) {
            // Find user group by name and organizationId
            const userGroup = await this.userGroupRepository.findOne({ where: { organisationId: organisationId, name: userGroupName } });
            if (!userGroup) {
                throw new ConflictException("This user group does not exist, please create one");
            } else {
                if (!userToFind) {
                    const key = uuidv4();
                    // Send email to non-existing user with registration link
                    const registerData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName });
                    await this.redis.set(key, registerData, 'EX', 7 * 24 * 60 * 60);
                    await this.sendRegistrationEmail(userEmail, key, userGroupName);
                    return { status: 'success', message: 'Invitation register email successful.' };
                } else {
                    // Generate random key
                    const key = uuidv4();

                    // Store the key in Redis with 7 days expiry time
                    const redisData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName });
                    await this.redis.set(key, redisData, 'EX', 7 * 24 * 60 * 60);

                    // Send email to existing user with invitation link
                    await this.sendInvitationEmail(userEmail, key, userGroupName);
                    return { status: 'success', message: 'Invitation email successful.' };
                }
            }
        }
    }

    async sendRegistrationEmail(email: string, token: string, userGroupName: string) {
        // Create a Nodemailer transporter using Google's SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'theskunkworks301@gmail.com',
                pass: this.configService.get('GOOGLE_PASSWORD')
            }
        });

        const registrationHtmlTemplate = readFileSync(join(__dirname, '../../src/services/registration-email-template.html'), 'utf-8');
        let registrationHtml = registrationHtmlTemplate.replace('{UserGroup}', userGroupName);
        registrationHtml = registrationHtmlTemplate.replace('{URL}', `http://fillInURL/${token}`);
        // Email options
        const mailOptions = {
            from: 'theskunkworks301@gmail.com',
            to: email,
            subject: `Invitation to "${userGroup}" on Avalanche Analytics`,
            html: registrationHtml,
            text: `You have been invited to join "{{UserGroup}}" on Avalanche Analytics.\n
            To accept the invitation please follow the link to register on our platform: 
            \nhttp://fillInURL/${token}`
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
                user: 'theskunkworks301@gmail.com',
                pass: this.configService.get('GOOGLE_PASSWORD')
            }
        });

        const invitationHtmlTemplate = readFileSync(join(__dirname, '../../src/services/invitation-email-template.html'), 'utf-8');
        let invitationHtml = invitationHtmlTemplate.replace('{UserGroup}', userGroupName);
        invitationHtml = invitationHtmlTemplate.replace('{URL}', `http://fillInURL/${token}`);
        // Email options
        const mailOptions = {
            from: 'theskunkworks301@gmail.com',
            to: email,
            subject: `Invitation to "${userGroupName}" on Avalanche Analytics`,
            html: invitationHtml,
            text: `You have been invited to join "{{UserGroup}}" on Avalanche Analytics.\n
            To accept the invitation please follow the link: 
            \nhttp://fillInURL/${token}`
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
        // Fetch user from the Redis store using the JWT token
        const userData = await this.redis.get(token);
        const userDetails = JSON.parse(userData);

        // Retrieve the user with their groups based on the token
        const user = await this.userRepository.findOne({ where: { email: userDetails.email }, relations: ['userGroups'] });
        if (!user) {
            throw new Error('User not found');
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users'] });
        if (!userGroup) {
            throw new Error('User group not found');
        }

        // Check if the user is part of the user group
        const isUserInGroup = user.userGroups.some(group => group.id === userGroup.id);
        if (!isUserInGroup) {
            throw new Error('User is not part of the specified user group');
        }

        // If it is an admin group and the user is the only one, throw error
        if (userGroup.name.includes('admin') && userGroup.users.length === 1) {
            throw new Error('Cannot remove the last admin from the admin group');
        }

        // Otherwise, remove the user from the group
        user.userGroups = user.userGroups.filter(group => group.id !== userGroup.id);
        user.userGroupId = null;
        // And remove the user from the group's users
        userGroup.users = userGroup.users.filter(u => u.id !== user.id);

        // Save the changes
        await this.userRepository.save(user);
        await this.userGroupRepository.save(userGroup);

        return { status: 'success', message: 'User removed from the user group successfully.' };
    }

    async removeUserFromUserGroup(token: string, userGroupName: string, userEmail: string) {
        // Retrieve the user with their groups based on the token
        const userData = await this.redis.get(token);
        const userDetails = JSON.parse(userData);
        const permission = userDetails.userGroups[0].permission;

        // Check if the invoking user has permission
        if (permission !== 1) {
            throw new Error('User does not have sufficient permissions');
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users'] });
        if (!userGroup) {
            throw new Error('User group not found');
        }

        // Retrieve the user to be removed based on the email
        const userToBeRemoved = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups'] });
        if (!userToBeRemoved) {
            throw new Error('User to be removed not found');
        }

        // Check if the user to be removed is part of the user group
        const isUserInGroup = userToBeRemoved.userGroups.some(group => group.id === userGroup.id);
        if (!isUserInGroup) {
            throw new Error('User to be removed is not part of the specified user group');
        }

        // If it is an admin group and the user is the only one, throw error
        if (userGroup.name.includes('admin')) {
            throw new Error('Cannot remove the last admin from the admin group');
        }

        // Otherwise, remove the user from the group
        userToBeRemoved.userGroups = userToBeRemoved.userGroups.filter(group => group.id !== userGroup.id);
        userToBeRemoved.userGroupId = null;
        // And remove the user from the group's users
        userGroup.users = userGroup.users.filter(u => u.id !== userToBeRemoved.id);

        // Save the changes
        await this.userRepository.save(userToBeRemoved);
        await this.userGroupRepository.save(userGroup);

        return { status: 'success', message: 'User removed from the user group successfully.' };
    }

    async addUserToUserGroupWithKey(token: string, key: string) {

        // Retrieve the data from Redis using the key
        const redisData = await this.redis.get(key);
        if (!redisData) {
            throw new Error('No data found for this key');
        }

        // Parse the data
        const { userEmail, userGroupName } = JSON.parse(redisData);

        // Retrieve the user with their groups based on the token
        let user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation'] });
        if (!user) {
            throw new Error('User not found');
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users', 'organisation'] });
        if (!userGroup) {
            throw new Error('User group not found');
        }

        // Check if the user is already part of the user group
        const isUserInGroup = user.userGroups.some(group => group.id === userGroup.id);
        if (isUserInGroup) {
            throw new Error('User is already part of this user group');
        }

        // If user's organisation is not the same as the group's organisation, throw an error
        if (user.organisationId && user.organisation?.id !== userGroup.organisation?.id) {
            throw new Error("User's organisation is different from the group's organisation");
        }

        // Add the user to the group
        user.organisationId = userGroup.organisationId;
        user.userGroupId = userGroup.id;
        user.userGroups.push(userGroup);

        // And add the user to the group's users
        userGroup.users.push(user);

        // Save the changes
        user = await this.userRepository.save(user);
        await this.userGroupRepository.save(userGroup);

        // Remove the key from Redis

        await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);
        await this.redis.del(key);
        return { status: 'success', message: 'User added to the user group successfully.' };
    }
}
