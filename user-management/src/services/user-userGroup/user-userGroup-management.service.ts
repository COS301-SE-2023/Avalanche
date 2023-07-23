/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
@Injectable()
export class UserUserGroupMangementService {
    constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>) { }

    async createUserGroup(token: string, name: string, permission: number) {
        // Get organizationId and the userPermission from Redis using token
        const userPayload = await this.redis.get(token);
        if (!userPayload) {
            return {
                status: 400, error: true, message: 'Invalid token',
                timestamp: new Date().toISOString()
            };
        }
        const user = JSON.parse(userPayload);
        if (!user) {
            return {
                status: "failure", message: 'User does not exist',
                timestamp: new Date().toISOString()
            };
        }
        const organisationId = user.organisation?.id;
        const userPermission = user.userGroups[0].permission;

        if (userPermission === 1) {
            const existingOrganisation = await this.organisationRepository.findOne({ where: { id: organisationId } });
            if (!existingOrganisation) {
                return {
                    status: 400, error: true, message: 'Organisation does not exist please create one',
                    timestamp: new Date().toISOString()
                };
            } else {
                if (name.length === 0) {
                    return {
                        status: 400, error: true, message: 'Please enter a user group name with characters and a length greater than zero',
                        timestamp: new Date().toISOString()
                    };
                }
                const userGroup = new UserGroup();
                userGroup.name = name;
                userGroup.organisation = existingOrganisation;
                userGroup.permission = permission;

                // Save the user group
                await this.userGroupRepository.save(userGroup);

                return {
                    status: 'success', message: userGroup,
                    timestamp: new Date().toISOString()
                };
            }
        } else {
            return {
                status: 'failure', message: 'User does not have the permissions to do so',
                timestamp: new Date().toISOString()
            };
        }
    }

    async addUserToUserGroup(token: string, userEmail: string, userGroupName: string) {
        // Get organizationId from Redis using token
        const userPayload = await this.redis.get(token);
        if (!userPayload) {
            return {
                status: 400, error: true, message: 'Invalid token',
                timestamp: new Date().toISOString()
            };
        }
        const user = JSON.parse(userPayload);
        const organisationId = user.organisation.id;
        const userPermission = user.userGroups[0].permission;
        const userToFind = await this.userRepository.findOne({ where: { email: userEmail } });
        if (userPermission == 1 || userPermission == 2) {
            // Find user group by name and organizationId
            const userGroup = await this.userGroupRepository.findOne({ where: { organisationId: organisationId, name: userGroupName } });
            if (!userGroup) {
                return {
                    status: 400, error: true, message: "This user group does not exist, please create one",
                    timestamp: new Date().toISOString()
                };
            } else {
                if (!userToFind) {
                    const key = uuidv4();
                    // Send email to non-existing user with registration link
                    const registerData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName });
                    await this.redis.set(key, registerData, 'EX', 7 * 24 * 60 * 60);
                    await this.sendRegistrationEmail(userEmail, key, userGroupName);
                    return {
                        status: 'success', message: 'Invitation register email successful.',
                        timestamp: new Date().toISOString()
                    };
                } else {
                    // Generate random key
                    const key = uuidv4();

                    // Store the key in Redis with 7 days expiry time
                    const redisData = JSON.stringify({ userEmail: userEmail, userGroupName: userGroupName });
                    await this.redis.set(key, redisData, 'EX', 7 * 24 * 60 * 60);
                    // Send email to existing user with invitation link
                    await this.sendInvitationEmail(userEmail, key, userGroupName);
                    return {
                        status: 'success', message: 'Invitation email successful.',
                        timestamp: new Date().toISOString()
                    };
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

        const registrationHtmlTemplate = readFileSync(join(__dirname, '/dist/html/registration-email-template.html'), 'utf-8');
        let registrationHtml = registrationHtmlTemplate.replace('{UserGroup}', userGroupName);
        registrationHtml = registrationHtml.replace('{url}', `http://localhost:3000/invitation?key=${token}&type=group`);
        // Email options
        const mailOptions = {
            from: 'theskunkworks301@gmail.com',
            to: email,
            subject: `Invitation to "${userGroupName}" on Avalanche Analytics`,
            html: registrationHtml,
            text: `You have been invited to join "${UserGroup}" on Avalanche Analytics.\n
                To accept the invitation please follow the link to register on our platform: 
                \nhttp://localhost:3000/invitation?key=${token}&type=group`
        };

        // Sending the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
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

        // const invitationHtmlTemplate = readFileSync('/home/node/dist/html/invitation-email-template.html', 'utf-8');
        // let invitationHtml = invitationHtmlTemplate.replace('{UserGroup}', userGroupName).replace('{url}', `http://localhost:3000/invitation?key=${token}&type=group`);
        // invitationHtml = invitationHtml;
        // Email options

        const mailOptions = {
            from: 'theskunkworks301@gmail.com',
            to: email,
            subject: `Invitation to "${userGroupName}" on Avalanche Analytics`,
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:300px;max-width:1000px;overflow:auto;line-height:2;margin: 0 auto;">
                        <div style="margin:20px auto;width:90%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #007aff;text-decoration:none;font-weight:600">Avalanche Analytics</a>
                        </div>
                        <p style="font-size:1.1em">Hi,</p>
                        <p>You have been invited to join ${userGroupName} on Avalanche Analytics. <br> 
                            To accept the invitation please follow the link: </p>
                        <a href="http://localhost:3000/invitation?key=${token}&type=group" style="text-decoration:none"> <h2 style="background: #007aff;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                            Accept
                        </h2></a>
                        <p style="font-size:0.9em;">Regards,<br />Avalanche Team</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300;text-align: center;">
                            <p>Avalanche</p>
                            <p>DNS Business</p>
                            <p>2023</p>
                        </div>
                        </div>
                    </div>`,
            text: `You have been invited to join "${userGroupName}" on Avalanche Analytics.\n
                To accept the invitation please follow the link: 
                \nhttp://localhost:3000/invitation?key=${token}&type=group`
        };


        // Sending the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
        });
    }

    async exitUserGroup(token: string, userGroupName: string) {
        // Fetch user from the Redis store using the JWT token
        const userData = await this.redis.get(token);
        if (!userData) {
            return {
                status: 400, error: true, message: 'Invalid token',
                timestamp: new Date().toISOString()
            };
        }
        const userDetails = JSON.parse(userData);

        // Retrieve the user with their groups based on the token
        const user = await this.userRepository.findOne({
            where: { email: userDetails.email }, relations: ['userGroups'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User not found',
                timestamp: new Date().toISOString()
            };
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users'] });
        if (!userGroup) {
            return {
                status: 400, error: true, message: 'User group not found',
                timestamp: new Date().toISOString()
            };
        }

        // Check if the user is part of the user group
        const isUserInGroup = user.userGroups.some(group => group.id === userGroup.id);
        if (!isUserInGroup) {
            return {
                status: 400, error: true, message: 'User is not part of the specified user group',
                timestamp: new Date().toISOString()
            };
        }

        // If it is an admin group and the user is the only one, throw error
        if (userGroup.name.includes('admin') && userGroup.users.length === 1) {
            return {
                status: 400, error: true, message: 'Cannot remove the last admin from the admin group',
                timestamp: new Date().toISOString()
            };
        }

        // Otherwise, remove the user from the group
        user.userGroups = user.userGroups.filter(group => group.id !== userGroup.id);
        // And remove the user from the group's users
        userGroup.users = userGroup.users.filter(u => u.id !== user.id);

        // Save the changes
        await this.userRepository.save(user);
        await this.userGroupRepository.save(userGroup);
        delete user.salt;
        delete user.apiKey;
        await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);

        return {
            status: 'success', message: user,
            timestamp: new Date().toISOString()
        };
    }

    async removeUserFromUserGroup(token: string, userGroupName: string, userEmail: string) {
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
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['users'] });
        if (!userGroup) {
            return {
                status: 400, error: true, message: 'User group not found',
                timestamp: new Date().toISOString()
            };
        }

        // Retrieve the user to be removed based on the email
        const userToBeRemoved = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups'] });
        if (!userToBeRemoved) {
            return {
                status: 400, error: true, message: 'User to be removed not found',
                timestamp: new Date().toISOString()
            };
        }

        // Check if the user to be removed is part of the user group
        const isUserInGroup = userToBeRemoved.userGroups.some(group => group.id === userGroup.id);
        if (!isUserInGroup) {
            return {
                status: 400, error: true, message: 'User to be removed is not part of the specified user group',
                timestamp: new Date().toISOString()
            };
        }

        // If it is an admin group and the user is the only one, throw error
        if (userGroup.name.includes('admin') && userGroup.users.length === 1) {
            return {
                status: 400, error: true, message: 'Cannot remove the last admin from the admin group',
                timestamp: new Date().toISOString()
            };
        }

        // Otherwise, remove the user from the group
        userToBeRemoved.userGroups = userToBeRemoved.userGroups.filter(group => group.id !== userGroup.id);
        // And remove the user from the group's users
        userGroup.users = userGroup.users.filter(u => u.id !== userToBeRemoved.id);

        // Save the changes
        await this.userRepository.save(userToBeRemoved);
        await this.userGroupRepository.save(userGroup);

        return {
            status: 'success', message: userGroup,
            timestamp: new Date().toISOString()
        };
    }

    async addUserToUserGroupWithKey(token: string, key: string) {

        // Retrieve the data from Redis using the key
        const redisData = await this.redis.get(key);
        if (!redisData) {
            return {
                status: 400, error: true, message: 'Invalid user group key',
                timestamp: new Date().toISOString()
            };
        }

        // Parse the data
        const { userEmail, userGroupName } = JSON.parse(redisData);

        console.log("EMAIL", userEmail, "GROUP NAME", userGroupName);

        // Retrieve the user with their groups based on the token
        const user = await this.userRepository.findOne({
            where: { email: userEmail }, relations: ['userGroups', 'organisation'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User not found',
                timestamp: new Date().toISOString()
            };
        }

        // Retrieve the user group based on the name
        const userGroup = await this.userGroupRepository.findOne({ where: { name: userGroupName }, relations: ['organisation'] });
        if (!userGroup) {
            return {
                status: 400, error: true, message: 'User group not found',
                timestamp: new Date().toISOString()
            };
        }

        // Check if the user is already part of the user group
        const isUserInGroup = user.userGroups.some(group => group.id === userGroup.id);
        if (isUserInGroup) {
            return {
                status: 400, error: true, message: 'User is already part of this user group',
                timestamp: new Date().toISOString()
            };
        }

        // If user's organisation is not the same as the group's organisation, throw an error
        if (user.organisation !== null && user.organisation.id !== null) {
            if (user.organisation?.id !== userGroup.organisation?.id) {
                return {
                    status: 400, error: true, message: "User's organisation is different from the group's organisation",
                    timestamp: new Date().toISOString()
                };
            }
        }

        // Add the user to the group
        user.organisation = userGroup.organisation;
        user.userGroups.push(userGroup);

        // Save the changes
        const userB = await this.userRepository.save(user);

        // Remove the key from Redis

        await this.redis.set(token, JSON.stringify(userB), 'EX', 24 * 60 * 60);
        await this.redis.del(key);
        return {
            status: 'success', message: userB,
            timestamp: new Date().toISOString()
        };
    }
}