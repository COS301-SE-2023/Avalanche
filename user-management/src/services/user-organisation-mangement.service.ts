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

    async getMembers(token: string) {
        const userPayload = await this.redis.get(token);
        if (!userPayload) {
            return {
                status: 400, error: true, message: 'Invalid token.',
                timestamp: new Date().toISOString()
            };
        }
        const { email: userEmail } = JSON.parse(userPayload);
        console.log(userEmail);
        const user = await this.userRepository.findOne({
            where: { email: userEmail }, relations: ['userGroups', 'organisation'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User does not exist.',
                timestamp: new Date().toISOString()
            };
        }
        console.log(user);
        const uniqueUsers = new Set();
        const usersInfo = [];
        const userGroupDetails = [];
        if (user.userGroups !== null) {
            for (const userGroup of user.userGroups) {
                const userGroupUsers = await this.userGroupRepository.findOne({ where: { name: userGroup.name }, relations: ['users'] });
                for (const groupUser of userGroupUsers.users) {
                    const userKey = `${groupUser.firstName}-${groupUser.lastName}-${groupUser.email}`;
                    if (!uniqueUsers.has(userKey)) {
                        uniqueUsers.add(userKey);
                        usersInfo.push({
                            firstName: groupUser.firstName,
                            lastName: groupUser.lastName,
                            email: groupUser.email
                        });
                        console.log(groupUser.email);
                        console.log(groupUser.firstName);
                        console.log(groupUser.lastName);
                    }
                }
                const userInfoCopy = [];
                usersInfo.forEach(val => userInfoCopy.push(Object.assign({}, val)));
                userGroupDetails.push({ userGroupName: userGroup.name, userGroupID: userGroup.id, groupMembers: userInfoCopy });
                uniqueUsers.clear();
                usersInfo.length = 0;
            }
        }
        return {
            status: 'success',
            users: userGroupDetails,
            timestamp: new Date().toISOString()
        };
    }
    async createOrganisation(token: string, name: string) {
        // Extract the JWT token
        // Retrieve the user's information from Redis using the token
        const userPayload = await this.redis.get(token);
        if (!userPayload) {
            return {
                status: 400, error: true, message: 'Invalid token.',
                timestamp: new Date().toISOString()
            };
        }
        const { email: userEmail } = JSON.parse(userPayload);
        console.log(userEmail);
        const user = await this.userRepository.findOne({
            where: { email: userEmail }, relations: ['userGroups', 'organisation'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User does not exist.',
                timestamp: new Date().toISOString()
            };
        }
        console.log(user);
        // Check if the user already belongs to an organisation
        if (user.organisation !== null && user.organisation.id !== null) {
            return {
                status: 400, error: true, message: 'User already belongs to an organisation',
                timestamp: new Date().toISOString()
            };
        }

        // Check if the organisation name is already taken
        const existingOrganisation = await this.organisationRepository.findOne({ where: { name: name } });
        if (existingOrganisation) {
            return {
                status: 400, error: true, message: 'Organisation with this name already exists',
                timestamp: new Date().toISOString()
            };
        }

        if (name.length === 0) {
            return {
                status: 400, error: true, message: 'Please enter an organisation with charceters and a length greater than 0',
                timestamp: new Date().toISOString()
            };
        }

        // Create the organisation
        const organisation = new Organisation();
        organisation.name = name;
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

        delete user.salt;
        // Update the user's information in Redis
        await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);

        return {
            status: 'success', message: user,
            timestamp: new Date().toISOString()
        };
    }

    async exitOrganisation(token: string, organisationName: string) {
        const userData = await this.redis.get(token);
        if (!userData) {
            return {
                status: 400, error: true, message: 'Invalid token',
                timestamp: new Date().toISOString()
            };
        }
        const userDetails = JSON.parse(userData);

        const userToBeRemoved = await this.userRepository.findOne({ where: { email: userDetails.email }, relations: ['userGroups', 'organisation'], select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation'] });
        if (!userToBeRemoved) {
            return {
                status: 400, error: true, message: 'User to be removed not found',
                timestamp: new Date().toISOString()
            };
        }

        const organisation = await this.organisationRepository.findOne({ where: { name: organisationName }, relations: ['userGroups', 'users'] });
        if (!organisation) {
            return {
                status: 400, error: true, message: 'Organisation cannot be found',
                timestamp: new Date().toISOString()
            };
        }

        // Remove the user from the organisation
        organisation.users = organisation.users.filter(user => user.id !== userToBeRemoved.id);
        await this.organisationRepository.save(organisation);

        // Remove the user from each of the user groups they are part of
        if (userToBeRemoved.userGroups !== null) {
            for (const group of userToBeRemoved.userGroups) {
                if (group.users) {
                    group.users = group.users.filter(user => user.id !== userToBeRemoved.id);
                    await this.userGroupRepository.save(group);
                }
            }
        }

        // At this point the user has been removed from all their user groups and their organisation.
        userToBeRemoved.organisationId = null;
        userToBeRemoved.organisation = null;
        userToBeRemoved.userGroups = null;
        await this.userRepository.save(userToBeRemoved);
        await this.redis.set(token, JSON.stringify(userToBeRemoved), 'EX', 24 * 60 * 60);
        return { status: 'success', message: { text: 'User removed from organisation and user groups', user: userToBeRemoved }, timestamp: new Date().toISOString() };
    }

    async removeUserFromOrganisation(token: string, organisationName: string, userEmail: string) {
        // Retrieve the user with their groups based on the token
        const userData = await this.redis.get(token);
        if (!userData) {
            return {
                status: 400, error: true, message: 'Invalid token',
                timestamp: new Date().toISOString()
            };
        }
        const userDetails = JSON.parse(userData);
        const permission = userDetails.userGroups[0].permission;

        // Check if the invoking user has permission
        if (permission !== 1) {
            return {
                status: 400, error: true, message: 'User does not have sufficient permissions',
                timestamp: new Date().toISOString()
            };
        }

        // Retrieve the user group based on the name
        const organisation = await this.organisationRepository.findOne({ where: { name: organisationName }, relations: ['users'] });
        if (!organisation) {
            return {
                status: 400, error: true, message: 'User group not found',
                timestamp: new Date().toISOString()
            };
        }

        // Retrieve the user to be removed based on the email
        const userToBeRemoved = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'userGroups.users'] });
        if (!userToBeRemoved) {
            return {
                status: 400, error: true, message: 'User to be removed not found',
                timestamp: new Date().toISOString()
            };
        }

        organisation.users = organisation.users.filter(user => user.id !== userToBeRemoved.id);
        await this.organisationRepository.save(organisation);

        // Remove the user from each of the user groups they are part of
        if (userToBeRemoved.userGroups !== null) {
            for (const group of userToBeRemoved.userGroups) {
                group.users = group.users.filter(user => user.id !== userToBeRemoved.id);
                await this.userGroupRepository.save(group);
            }
        }

        // At this point the user has been removed from all their user groups and their organisation.
        userToBeRemoved.organisation = null;
        userToBeRemoved.userGroups = null;
        await this.userRepository.save(userToBeRemoved);
        return { status: 'success', message: 'User removed from organisation and user groups', timestamp: new Date().toISOString() };
    }
}
