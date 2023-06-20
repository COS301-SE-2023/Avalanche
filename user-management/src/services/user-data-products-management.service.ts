/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from 'src/entity/userGroup.entity';
import { Organisation } from 'src/entity/organisation.entity';
import axios from 'axios';
import { Response } from 'express';
import { Res} from '@nestjs/common';

@Injectable()
export class UserDataProductMangementService {
    constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>) { }

    async integrateUserWithWExternalAPI(token: string, type: string, allocateToName: string, username: string, password: string, personal: boolean) {
        if(!username || !password){
            return { 
                status: 400,
                error: true,
                message: 'Please enter all account details',
                timestamp: new Date().toISOString()
              };
        }
        if (personal == true) {
            let url = 'https://srs-epp.dns.net.za:8282/portal/auth-jwt/';
            const payload = {
                username: username,
                password: password
            };

            try {
                const response = await axios.post(url, payload, {
                });

                const tokenFromDNS = response.data.token;
                url = 'https://srs-epp.dns.net.za:8282/portal/auth-epp-username/'
                try {
                    const responseGET = await axios.get(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenFromDNS}`
                        }
                    });

                    console.log(responseGET.data);
                    let integrationString = responseGET.data.epp_username;
                    if (type.includes("AFRICA")) {
                        integrationString += "-" + type + ",";
                    } else if (type.includes("ZACR")) {
                        integrationString += "-" + type + ",";
                    } else if (type.includes("RyCE")) {
                        integrationString += "-" + type + ",";
                    }
                    const user = await this.userRepository.findOne({ where: { email: allocateToName } });
                    if(!user){
                        return {status : 'failure', message : 'User does not exist', 
                        timestamp: new Date().toISOString()};
                    }
                    user.products += integrationString;
                    await this.userRepository.save(user);
                    return { status: 'success', message: 'User is integrated with DNS', 
                    timestamp: new Date().toISOString() };
                } catch (error) {
                    console.error(error);
                    return { status: 400,error: true, message: error, 
                    timestamp: new Date().toISOString() };
                }
            } catch (error) {
                console.error(error);
                return { status: 400,error: true, message: error, 
                timestamp: new Date().toISOString() };
            }
        } else {
            // Retrieve the user with their groups based on the token
            const userData = await this.redis.get(token);
            if(!userData){
                return {status : 'failure', message : 'Invalid token', 
                timestamp: new Date().toISOString()};
            }
            const userDetails = JSON.parse(userData);
            const permission = userDetails.userGroups[0].permission;
            if (permission == 1) {
                let url = 'https://srs-epp.dns.net.za:8282/portal/auth-jwt/';
                const payload = {
                    username: username,
                    password: password
                };

                try {
                    const response = await axios.post(url, payload, {
                    });

                    const tokenFromDNS = response.data.token;
                    url = 'https://srs-epp.dns.net.za:8282/portal/auth-epp-username/'
                    try {
                        const responseGET = await axios.get(url, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${tokenFromDNS}`
                            }
                        });

                        console.log(responseGET.data);
                        let integrationString = responseGET.data.epp_username;
                        if (type.includes("AFRICA")) {
                            integrationString += "-" + type + ",";
                        } else if (type.includes("ZACR")) {
                            integrationString += "-" + type + ",";
                        } else if (type.includes("RyCE")) {
                            integrationString += "-" + type + ",";
                        }
                        const userGroup = await this.userGroupRepository.findOne({ where: { name: allocateToName } });
                        if(!userGroup){
                            return {status : 'failure', message : 'Cannot find user group with the given name', 
                            timestamp: new Date().toISOString()}
                        }
                        userGroup.products += integrationString;
                        await this.userRepository.save(userGroup);
                        return { status: 'success', message: 'User is integrated with DNS', 
                        timestamp: new Date().toISOString() };
                    } catch (error) {
                        console.error(error);
                        return { status: 'error', message: error, 
                        timestamp: new Date().toISOString() };
                    }
                } catch (error) {
                    console.error(error);
                    return { status: 'error', message: error, 
                    timestamp: new Date().toISOString() };
                }
            }
        }
        return null;
    }

    async integrateWithDataProducts(token: string, type: string, allocateToName: string, personal: boolean) {
        if (personal == true) {
            let typeW;
            if (type.length > 0) {
                typeW += type + ',';
            }
            const user = await this.userRepository.findOne({ where: { email: allocateToName } });
            if(!user){
                return {status : 'failure', message : 'User does not exist', 
                timestamp: new Date().toISOString()};
            }
            user.products += typeW;
            await this.userRepository.save(user);
            return { status: 'success', message: 'User is integrated with ' + type , 
            timestamp: new Date().toISOString()};
        } else if (personal == false) {
            // Retrieve the user with their groups based on the token
            const userData = await this.redis.get(token);
            const userDetails = JSON.parse(userData);
            const permission = userDetails.userGroups[0].permission;
            if (permission == 1) {
                let typeW;
                if (type.length > 0) {
                    typeW += type + ',';
                }
                const userGroup = await this.userGroupRepository.findOne({ where: { name: allocateToName } });
                if(!userGroup){
                    return {status : 'failure', message : 'Cannot find user group with given name', 
                    timestamp: new Date().toISOString()}
                }
                userGroup.products += typeW;
                await this.userGroupRepository.save(userGroup);
                return { status: 'success', message: 'User group is integrated with ' + type , 
                timestamp: new Date().toISOString()};
            } else {
                return { status: 400,error: true, message: 'User does not have the right permissions', 
                timestamp: new Date().toISOString() };
            }
        } else {
            return { status: 400,error: true, message: 'Error occured, please try later again' , 
            timestamp: new Date().toISOString()};
        }
    }
}