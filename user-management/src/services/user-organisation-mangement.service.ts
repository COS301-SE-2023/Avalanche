/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from '../entity/userGroup.entity';
import { Organisation } from '../entity/organisation.entity';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
@Injectable()
export class UserOrganisationMangementService {
    constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>) { }

    async createOrganisation(token: string, name: string) {
        // Extract the JWT token
        // Retrieve the user's information from Redis using the token
        const userPayload = await this.redis.get(token);
        if(!userPayload){
            return { status: 400,error: true, message: 'Invalid token.', 
            timestamp: new Date().toISOString() };
        }
        const { email: userEmail } = JSON.parse(userPayload);
        console.log(userEmail);
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
        if(!user){
            return { status: 400,error: true, message: 'User does not exist.', 
            timestamp: new Date().toISOString() };
        }
        console.log(user);
        // Check if the user already belongs to an organisation
        if (user.organisationId) {
            return { status: 400,error: true, message: 'User already belongs to an organisation', 
            timestamp: new Date().toISOString()};
        }

        // Check if the organisation name is already taken
        const existingOrganisation = await this.organisationRepository.findOne({ where: { name: name } });
        if (existingOrganisation) {
            return { status: 400,error: true, message: 'Organisation with this name already exists', 
            timestamp: new Date().toISOString()};
        }

        if(name.startsWith('') || name.length == 0){
            return { status: 400,error: true, message: 'Please enter an organisation with charceters and a length greater than 0', 
            timestamp: new Date().toISOString()};
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

        return { status: 'success', message : token, 
        timestamp: new Date().toISOString()};
    }

    async createUserGroup(token: string, name: string, permission: number) {
        // Get organizationId and the userPermission from Redis using token
        const userPayload = await this.redis.get(token);
        if(!userPayload){
            return { status: 400,error: true, message: 'Invalid token', 
            timestamp: new Date().toISOString()};
        }
        const user = JSON.parse(userPayload);
        if(!user){
            return {status : "failure", message: 'User does not exist', 
            timestamp: new Date().toISOString()};
        }
        const organisationId = user.organisationId;
        const userPermission = user.userGroups[0].permission;

        if (userPermission == 1) {
            const existingOrganisation = await this.organisationRepository.findOne({ where: { id: organisationId } });
            if (!existingOrganisation) {
                return { status: 400,error: true, message: 'Organisation does not exist please create one', 
                timestamp: new Date().toISOString()};
            } else {
                if(name.startsWith('') || name.length == 0){
                    return { status: 400,error: true, message: 'Please enter a user group name with characters and a length greater than zero', 
                timestamp: new Date().toISOString()};
                }
                const userGroup = new UserGroup();
                userGroup.name = name;
                userGroup.organisation = existingOrganisation;
                userGroup.permission = permission;

                // Save the user group
                await this.userGroupRepository.save(userGroup);

                return { status : 'success', message: userGroup , 
                timestamp: new Date().toISOString()};
            }
        } else {
            return { status : 'failure', message: 'User does not have the permissions to do so', 
            timestamp: new Date().toISOString()};
        }
    }

    async addUserToUserGroup(token: string, userEmail: string, userGroupName: string) {
        // Get organizationId from Redis using token
        const userPayload = await this.redis.get(token);
        if(!userPayload){
            return { status: 400,error: true, message: 'Invalid token', 
            timestamp: new Date().toISOString()};
        }
        const user = JSON.parse(userPayload);
        const organisationId = user.organisationId;
        const userPermission = user.userGroups[0].permission;
        const userToFind = await this.userRepository.findOne({ where: { email: userEmail } });
        if (userPermission == 1 || userPermission == 2) {
            // Find user group by name and organizationId
            const userGroup = await this.userGroupRepository.findOne({ where: { organisationId: organisationId, name: userGroupName } });
            if (!userGroup) {
                return { status: 400,error: true, message: "This user group does not exist, please create one", 
                timestamp: new Date().toISOString()};
            } else {
                if (!userToFind) {
                    const key = uuidv4();
                    // Send email to non-existing user with registration link
                    const registerData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName });
                    await this.redis.set(key, registerData, 'EX', 7 * 24 * 60 * 60);
                    await this.sendRegistrationEmail(userEmail, key, userGroupName);
                    return { status: 'success', message: 'Invitation register email successful.', 
                    timestamp: new Date().toISOString() };
                } else {
                    // Generate random key
                    const key = uuidv4();

                    // Store the key in Redis with 7 days expiry time
                    const redisData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName });
                    await this.redis.set(key, redisData, 'EX', 7 * 24 * 60 * 60);

                    // Send email to existing user with invitation link
                    await this.sendInvitationEmail(userEmail, key, userGroupName);
                    return { status: 'success', message: 'Invitation email successful.', 
                    timestamp: new Date().toISOString() };
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

        const registrationHtmlTemplate = readFileSync(join(__dirname, '../../src/html/registration-email-template.html'), 'utf-8');
        let registrationHtml = registrationHtmlTemplate.replace('{UserGroup}', userGroupName);
        registrationHtml = registrationHtmlTemplate.replace('{URL}', `http://fillInURL/${token}`);
        // Email options
        const mailOptions = {
            from: 'theskunkworks301@gmail.com',
            to: email,
            subject: `Invitation to "${userGroupName}" on Avalanche Analytics`,
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

        const invitationHtmlTemplate = readFileSync(join(__dirname, '../../src/html/invitation-email-template.html'), 'utf-8');
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
        if(!userData){
            return { status: 400,error: true, message: 'Invalid token', 
            timestamp: new Date().toISOString()};
        }
        const userDetails = JSON.parse(userData);

        // Retrieve the user with their groups based on the token
        const user = await this.userRepository.findOne({ where: { email: userDetails.email }, relations: ['userGroups'] });
        if (!user) {
            return { status: 400,error: true, message: 'User not found', 
            timestamp: new Date().toISOString()};
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users'] });
        if (!userGroup) {
            return { status: 400,error: true, message: 'User group not found', 
            timestamp: new Date().toISOString()};
        }

        // Check if the user is part of the user group
        const isUserInGroup = user.userGroups.some(group => group.id === userGroup.id);
        if (!isUserInGroup) {
            return { status: 400,error: true, message: 'User is not part of the specified user group', 
            timestamp: new Date().toISOString()};
        }

        // If it is an admin group and the user is the only one, throw error
        if (userGroup.name.includes('admin') && userGroup.users.length === 1) {
            return { status: 400,error: true, message: 'Cannot remove the last admin from the admin group', 
            timestamp: new Date().toISOString()};
        }

        // Otherwise, remove the user from the group
        user.userGroups = user.userGroups.filter(group => group.id !== userGroup.id);
        user.userGroupId = null;
        // And remove the user from the group's users
        userGroup.users = userGroup.users.filter(u => u.id !== user.id);

        // Save the changes
        await this.userRepository.save(user);
        await this.userGroupRepository.save(userGroup);
        await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);

        return { status: 'success', message: 'User removed from the user group successfully.', 
        timestamp: new Date().toISOString() };
    }

    async removeUserFromUserGroup(token: string, userGroupName: string, userEmail: string) {
        // Retrieve the user with their groups based on the token
        const userData = await this.redis.get(token);
        if(!userData){
            return { status: 400,error: true, message: 'Invalid token', 
            timestamp: new Date().toISOString()};
        }
        const userDetails = JSON.parse(userData);
        const permission = userDetails.userGroups[0].permission;

        // Check if the invoking user has permission
        if (permission !== 1) {
            return { status: 400,error: true, message: 'User does not have sufficient permissions', 
            timestamp: new Date().toISOString()};
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users'] });
        if (!userGroup) {
            return { status: 400,error: true, message: 'User group not found', 
            timestamp: new Date().toISOString()};
        }

        // Retrieve the user to be removed based on the email
        const userToBeRemoved = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups'] });
        if (!userToBeRemoved) {
            return { status: 400,error: true, message: 'User to be removed not found', 
            timestamp: new Date().toISOString()};
        }

        // Check if the user to be removed is part of the user group
        const isUserInGroup = userToBeRemoved.userGroups.some(group => group.id === userGroup.id);
        if (!isUserInGroup) {
            return { status: 400,error: true, message: 'User to be removed is not part of the specified user group', 
            timestamp: new Date().toISOString()};
        }

        // If it is an admin group and the user is the only one, throw error
        if (userGroup.name.includes('admin')) {
            return { status: 400,error: true, message: 'Cannot remove the last admin from the admin group', 
            timestamp: new Date().toISOString()};
        }

        // Otherwise, remove the user from the group
        userToBeRemoved.userGroups = userToBeRemoved.userGroups.filter(group => group.id !== userGroup.id);
        userToBeRemoved.userGroupId = null;
        // And remove the user from the group's users
        userGroup.users = userGroup.users.filter(u => u.id !== userToBeRemoved.id);

        // Save the changes
        await this.userRepository.save(userToBeRemoved);
        await this.userGroupRepository.save(userGroup);
        await this.redis.set(token, JSON.stringify(userToBeRemoved), 'EX', 24 * 60 * 60);

        return { status: 'success', message: 'User removed from the user group successfully.', 
        timestamp: new Date().toISOString() };
    }

    async addUserToUserGroupWithKey(token: string, key: string) {

        // Retrieve the data from Redis using the key
        const redisData = await this.redis.get(key);
        if (!redisData) {
            return { status: 400,error: true, message: 'Invalid user group key', 
            timestamp: new Date().toISOString()};
        }

        // Parse the data
        const { userEmail, userGroupName } = JSON.parse(redisData);

        // Retrieve the user with their groups based on the token
        let user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation'] });
        if (!user) {
            return { status: 400,error: true, message: 'User not found', 
            timestamp: new Date().toISOString()};
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users', 'organisation'] });
        if (!userGroup) {
            return { status: 400,error: true, message: 'User group not found', 
            timestamp: new Date().toISOString()};
        }

        // Check if the user is already part of the user group
        const isUserInGroup = user.userGroups.some(group => group.id === userGroup.id);
        if (isUserInGroup) {
            return { status: 400,error: true, message: 'User is already part of this user group', 
            timestamp: new Date().toISOString()};
        }

        // If user's organisation is not the same as the group's organisation, throw an error
        if (user.organisationId && user.organisation?.id !== userGroup.organisation?.id) {
            return { status: 400,error: true, message: "User's organisation is different from the group's organisation", 
            timestamp: new Date().toISOString()};
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
        return { status: 'success', message: 'User added to the user group successfully.',
        timestamp: new Date().toISOString() };
    }
}
