/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import axios from 'axios';
import { WatchedUser } from '../../entity/watch.entity';
import { Endpoint } from '../../entity/endpoint.entity';

@Injectable()
export class UserDataProductMangementService {
    constructor(@Inject('REDIS') private readonly redis: Redis,
        @InjectRepository(User, 'user') private userRepository: Repository<User>,
        @InjectRepository(UserGroup, 'user') private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(WatchedUser, 'user') private watchedUserRepository: Repository<WatchedUser>,
        @InjectRepository(Endpoint, 'filters') private endpointRepository: Repository<Endpoint>) { }

    async integrateUserWithAfricaExternalAPI(token: string, type: string, allocateToName: string, username: string, password: string, personal: boolean) {
        if (!username || !password) {
            return {
                status: 400,
                error: true,
                message: 'Please enter all account details',
                timestamp: new Date().toISOString()
            };
        }
        if (personal == true) {
            try {
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

                        let key = responseGET.data.epp_username;
                        const type = "registrar"
                        const userPayload = await this.redis.get(token);
                        if (!userPayload) {
                            return {
                                status: 400, error: true, message: 'Invalid token.',
                                timestamp: new Date().toISOString()
                            };
                        }
                        const { email: userEmail } = JSON.parse(userPayload);
                        console.log(userEmail);
                        if (userEmail) {
                            const user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'] });
                            if (!user) {
                                return {
                                    status: 400, error: true, message: 'User does not exist',
                                    timestamp: new Date().toISOString()
                                };
                            }
                            for (const products of user.products) {
                                if (products.dataSource == "africa") {
                                    products.key = key;
                                    products.tou = type
                                }
                            }
                            await this.userRepository.save(user);
                            delete user.password;
                            delete user.salt;
                            delete user.apiKey;
                            await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);
                            return {
                                status: 'success', message: user,
                                timestamp: new Date().toISOString()
                            };
                        } else {
                            return {
                                status: 400, error: true, message: "You are allocating this to another user",
                                timestamp: new Date().toISOString()
                            };
                        }
                    } catch (error) {
                        console.error(error);
                        return {
                            status: 400, error: true, message: error,
                            timestamp: new Date().toISOString()
                        };
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        status: 400, error: true, message: "User details are incorrect for API",
                        timestamp: new Date().toISOString()
                    };
                }
            } catch (e) {
                return {
                    status: 400, error: true, message: "User details are incorrect for API",
                    timestamp: new Date().toISOString()
                };
            }
        } else {
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
                        const key = responseGET.data.epp_username;
                        const type = "registrar"
                        const userPayload = await this.redis.get(token);
                        if (!userPayload) {
                            return {
                                status: 400, error: true, message: 'Invalid token.',
                                timestamp: new Date().toISOString()
                            };
                        }
                        const { email: userEmail } = JSON.parse(userPayload);
                        const user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'] });
                        if (!user) {
                            return {
                                status: 400, error: true, message: 'User does not exist',
                                timestamp: new Date().toISOString()
                            };
                        }
                        let check = false;
                        for (const userGroup of user.userGroups) {
                            if (userGroup.name == allocateToName) {
                                check = true;
                            }
                        }
                        if (check == true) {
                            const userGroup = await this.userGroupRepository.findOne({ where: { name: allocateToName } });
                            if (!userGroup) {
                                return {
                                    status: 400, error: true, message: 'Cannot find user group with the given name',
                                    timestamp: new Date().toISOString()
                                }
                            }
                            for (const products of userGroup.products) {
                                if (products.dataSource == "africa") {
                                    products.key = key;
                                    products.tou = type
                                }
                            }
                            await this.userRepository.save(userGroup);
                            delete user.apiKey;
                            delete user.salt;
                            delete user.password;
                            await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);
                            return {
                                status: 'success', message: user,
                                timestamp: new Date().toISOString()
                            };
                        } else {
                            return {
                                status: 400, error: true, message: 'User is not apart of this user group',
                                timestamp: new Date().toISOString()
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        return {
                            status: 400, error: true, message: error,
                            timestamp: new Date().toISOString()
                        };
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        status: 400, error: true, message: error,
                        timestamp: new Date().toISOString()
                    };
                }
            }
        }
        return null;
    }

    async integrateUserWithZARCExternalAPI(token: string, type: string, allocateToName: string, username: string, password: string, personal: boolean) {
        if (!username || !password) {
            return {
                status: 400,
                error: true,
                message: 'Please enter all account details',
                timestamp: new Date().toISOString()
            };
        }
        if (personal == true) {
            try {
                let url = 'https://epp.zarc.net.za:8282/portal/auth-jwt/';
                const payload = {
                    username: username,
                    password: password
                };

                try {
                    const response = await axios.post(url, payload, {
                    });

                    const tokenFromDNS = response.data.token;
                    url = 'https://epp.zarc.net.za:8282/portal/auth-epp-username/'
                    try {
                        const responseGET = await axios.get(url, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${tokenFromDNS}`
                            }
                        });

                        let key = responseGET.data.epp_username;
                        const type = "registrar"
                        const userPayload = await this.redis.get(token);
                        if (!userPayload) {
                            return {
                                status: 400, error: true, message: 'Invalid token.',
                                timestamp: new Date().toISOString()
                            };
                        }
                        const { email: userEmail } = JSON.parse(userPayload);
                        if (userEmail) {
                            const user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'] });
                            if (!user) {
                                return {
                                    status: 400, error: true, message: 'User does not exist',
                                    timestamp: new Date().toISOString()
                                };
                            }
                            for (const products of user.products) {
                                if (products.dataSource == "zarc") {
                                    products.key = key;
                                    products.tou = type
                                }
                            }
                            await this.userRepository.save(user);
                            delete user.password;
                            delete user.salt;
                            delete user.apiKey;
                            await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);
                            return {
                                status: 'success', message: user,
                                timestamp: new Date().toISOString()
                            };
                        } else {
                            return {
                                status: 400, error: true, message: "You are allocating this to another user",
                                timestamp: new Date().toISOString()
                            };
                        }
                    } catch (error) {
                        console.error(error);
                        return {
                            status: 400, error: true, message: error,
                            timestamp: new Date().toISOString()
                        };
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        status: 400, error: true, message: "User details are incorrect for API",
                        timestamp: new Date().toISOString()
                    };
                }
            } catch (e) {
                return {
                    status: 400, error: true, message: "User details are incorrect for API",
                    timestamp: new Date().toISOString()
                };
            }
        } else {
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
                        const key = responseGET.data.epp_username;
                        const type = "registrar"
                        const userPayload = await this.redis.get(token);
                        if (!userPayload) {
                            return {
                                status: 400, error: true, message: 'Invalid token.',
                                timestamp: new Date().toISOString()
                            };
                        }
                        const { email: userEmail } = JSON.parse(userPayload);
                        const user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'] });
                        if (!user) {
                            return {
                                status: 400, error: true, message: 'User does not exist',
                                timestamp: new Date().toISOString()
                            };
                        }
                        let check = false;
                        for (const userGroup of user.userGroups) {
                            if (userGroup.name == allocateToName) {
                                check = true;
                            }
                        }
                        if (check == true) {
                            const userGroup = await this.userGroupRepository.findOne({ where: { name: allocateToName } });
                            if (!userGroup) {
                                return {
                                    status: 400, error: true, message: 'Cannot find user group with the given name',
                                    timestamp: new Date().toISOString()
                                }
                            }
                            for (const products of userGroup.products) {
                                if (products.dataSource == "zarc") {
                                    products.key = key;
                                    products.tou = type
                                }
                            }
                            await this.userRepository.save(userGroup);
                            delete user.apiKey;
                            delete user.salt;
                            delete user.password;
                            await this.redis.set(token, JSON.stringify(user), 'EX', 24 * 60 * 60);
                            return {
                                status: 'success', message: user,
                                timestamp: new Date().toISOString()
                            };
                        } else {
                            return {
                                status: 400, error: true, message: 'User is not apart of this user group',
                                timestamp: new Date().toISOString()
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        return {
                            status: 400, error: true, message: error,
                            timestamp: new Date().toISOString()
                        };
                    }
                } catch (error) {
                    console.error(error);
                    return {
                        status: 400, error: true, message: error,
                        timestamp: new Date().toISOString()
                    };
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
            const userPayload = await this.redis.get(token);
            if (!userPayload) {
                return {
                    status: 400, error: true, message: 'Invalid token.',
                    timestamp: new Date().toISOString()
                };
            }
            const { email: userEmail } = JSON.parse(userPayload);
            console.log(userEmail);
            if (allocateToName == userEmail) {
                const user = await this.userRepository.findOne({ where: { email: allocateToName }, relations: ['userGroups', 'organisation', 'dashboards'] });
                if (!user) {
                    return {
                        status: 400, error: true, message: 'User does not exist',
                        timestamp: new Date().toISOString()
                    };
                }
                user.products += typeW;
                await this.userRepository.save(user);
                return {
                    status: 'success', message: user,
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    status: 400, error: true, message: 'User does not have the same details as given',
                    timestamp: new Date().toISOString()
                };
            }
        } else if (personal == false) {
            // Retrieve the user with their groups based on the token
            const userData = await this.redis.get(token);
            const userDetails = JSON.parse(userData);
            const permission = userDetails.userGroups[0].permission;
            if (permission === 1) {
                let typeW;
                if (type.length > 0) {
                    typeW += type + ',';
                }
                const userPayload = await this.redis.get(token);
                if (!userPayload) {
                    return {
                        status: 400, error: true, message: 'Invalid token.',
                        timestamp: new Date().toISOString()
                    };
                }
                const { email: userEmail } = JSON.parse(userPayload);
                const user = await this.userRepository.findOne({ where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'] });
                if (!user) {
                    return {
                        status: 400, error: true, message: 'User does not exist',
                        timestamp: new Date().toISOString()
                    };
                }
                let check = false;
                for (const userGroup of user.userGroups) {
                    if (userGroup.name == allocateToName) {
                        check = true;
                    }
                }
                if (check == true) {
                    const userGroup = await this.userGroupRepository.findOne({ where: { name: allocateToName } });
                    if (!userGroup) {
                        return {
                            status: 400, error: true, message: 'Cannot find user group with given name',
                            timestamp: new Date().toISOString()
                        }
                    }
                    userGroup.products += typeW;
                    await this.userGroupRepository.save(userGroup);
                    return {
                        status: 'success', message: 'User group is integrated with ' + type,
                        timestamp: new Date().toISOString()
                    };
                } else {
                    return {
                        status: 400, error: true, message: 'User is not apart of this user group',
                        timestamp: new Date().toISOString()
                    };
                }
            } else {
                return {
                    status: 400, error: true, message: 'User does not have the right permissions',
                    timestamp: new Date().toISOString()
                };
            }
        } else {
            return {
                status: 400, error: true, message: 'Error occured, please try later again',
                timestamp: new Date().toISOString()
            };
        }
    }

    async addDomainWatchPassiveDetails(token: string, types: { type: string; threshold: number; }[], domains: string[]) {
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
            where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'dashboards']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User does not exist.',
                timestamp: new Date().toISOString()
            };
        }

        const watchedFoundUser = await this.watchedUserRepository.findOne({
            where: { email: user.email }
        });

        if (watchedFoundUser) {
            watchedFoundUser.types = types;
            watchedFoundUser.domains = domains;
            await this.watchedUserRepository.save(watchedFoundUser);
            return {
                status: "success",
                message: "User watched list details updated",
                timestamp: new Date().toISOString()
            };
        }
        // If the user exists, add them to the WatchedUser table
        const watchedUser = new WatchedUser();
        watchedUser.person = user.firstName + " " + user.lastName; // Set the person's name
        watchedUser.types = types; // Assign the types
        watchedUser.domains = domains; // Assign the domains
        watchedUser.email = user.email; //Assign the email

        await this.watchedUserRepository.save(watchedUser);

        return {
            status: "success",
            message: "User added to watched list",
            timestamp: new Date().toISOString()
        };
    }

    async getDomainWatchPassiveUser(token: string) {
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
            where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'dashboards']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User does not exist.',
                timestamp: new Date().toISOString()
            };
        }
        const passiveData = await this.watchedUserRepository.findOne({ where: { email: user.email }, select: ["person", "types", "domains"] });
        const emailData = await this.watchedUserRepository.findOne({ where: { email: user.email }, select: ["person", "email", "domains"] });
        console.log("here");
        if (passiveData && emailData) {
            return { status: "success", message: { watched: passiveData, emailData: emailData }, timestamp: new Date().toISOString() };
        }
        else {
            return {
                status: 400, error: true, message: 'Null, there is no domains to be watched',
                timestamp: new Date().toISOString()
            };
        }
    }

    async getDomainWatchPassive() {
        const passiveData = await this.watchedUserRepository.find({ select: ["person", "types", "domains"] });
        const emailData = await this.watchedUserRepository.find({ select: ["person", "email", "domains"] });
        console.log("here");
        if (passiveData && emailData) {
            return { watched: passiveData, emailData: emailData };
        }
        else {
            return {
                status: 400, error: true, message: 'Null, there is no domains to be watched',
                timestamp: new Date().toISOString()
            };
        }
    }

    async getFilters(token: string) {
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
            where: { email: userEmail }, relations: ['userGroups', 'organisation', 'dashboards'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'dashboards']
        });
        if (!user) {
            return {
                status: 400, error: true, message: 'User does not exist.',
                timestamp: new Date().toISOString()
            };
        }

        // Initialize an array to store the final result
        const result = [];

        // Iterate through the user's products
        const allProducts = [...user.products, ...user.userGroups.flatMap(ug => ug.products)];

        for (const product of allProducts) {
            let dataSource = product.dataSource;
            const tou = product.tou;
            if (dataSource == 'zarc') {
                dataSource = 'zacr';
            }
            // Find the endpoints related to the current data source
            const endpoint = await this.endpointRepository.findOne({
                where: { endpoint: dataSource }, // Match the endpoint with the dataSource
                relations: ['graphs', 'graphs.filters']
            });

            // Iterate through the endpoints and collect the endpoints, graphs, and filters based on TOU

            const graphsByTOU = endpoint.graphs.filter(graph => graph.user === tou);

            // If there are graphs that match the TOU, include the endpoint along with graphs and filters
            if (graphsByTOU.length > 0) {
                result.push({
                    endpoint: dataSource, graphs: graphsByTOU
                });
            }
        }

        return { "status": "success", "message": result };
    }

    async getEndpoints(token: string) {
        const userPayload = await this.redis.get(token);
        if (!userPayload) {
            return {
                status: 400, error: true, message: 'Invalid token.',
                timestamp: new Date().toISOString()
            };
        }
    
        const { email: userEmail } = JSON.parse(userPayload);
        const user = await this.userRepository.findOne({
            where: { email: userEmail },
            relations: ['userGroups', 'organisation', 'dashboards'],
            select: ['id', 'email', 'firstName', 'lastName', 'organisationId', 'products', 'userGroups', 'organisation', 'dashboards']
        });
    
        if (!user) {
            return {
                status: 400, error: true, message: 'User does not exist.',
                timestamp: new Date().toISOString()
            };
        }
    
        const redisEndpoint = JSON.parse(await this.redis.get('persephone'));
        
        // Initialize an empty object to store the filtered endpoints
        const filteredEndpoints: any = {};
    
        // Loop over the user's products to filter endpoints
        for (const product of user.products) {
            let dataSource = product.dataSource;
            if(product.dataSource == 'zarc'){
                dataSource = 'zacr'
            }
            const tou = product.tou;
    
            // Loop through the data from Redis to find matching dataSource and tou
            for (const data of redisEndpoint.data) {
                if (data[dataSource]) {
                    for (const touData of data[dataSource]) {
                        if (touData[tou]) {
                            // Add to filteredEndpoints
                            if (!filteredEndpoints[dataSource]) {
                                filteredEndpoints[dataSource] = {};
                            }
                            filteredEndpoints[dataSource] ={"tou": tou, "endpoints" : touData[tou]};
                        }
                    }
                }
            }
        }
    
        return {
            status: "success",
            data: filteredEndpoints,
            message: 'Filtered endpoints fetched successfully.',
            timestamp: new Date().toISOString()
        };
    }
    
}