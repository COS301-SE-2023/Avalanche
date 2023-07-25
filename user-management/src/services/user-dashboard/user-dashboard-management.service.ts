/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import { Dashboard } from '../../entity/dashboard.entity';
import { time, timeStamp } from 'console';
@Injectable()
export class UserDashboardMangementService {
    constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>,
        @InjectRepository(Dashboard) private dashboardRepository: Repository<Dashboard>) { }

    async saveDashbaord(token: string, dashboardID: string, name: string, graphs: { graphName: string, endpointName: string, filters: string[], comments: [{ userName: string; comment: string; }] }[]) {
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

        for (const dashboards of user.dashboards) {
            if (dashboards.name == name) {
                return {
                    status: 400, error: true, message: 'This name is already in use.',
                    timestamp: new Date().toISOString()
                };
            }
        }

        if (!name || name.length == 0) {
            name = 'dashboard-' + (user.dashboards.length + 1);
        }

        const dashboard = new Dashboard();
        dashboard.name = name;
        dashboard.dashboardID = dashboardID;
        dashboard.graphs = graphs;
        await this.dashboardRepository.save(dashboard);

        user.dashboards.push(dashboard);
        await this.userRepository.save(user);

        await this.redis.set(token, JSON.stringify(user))
        delete user.salt;
        delete user.apiKey;

        return {
            status: "success",
            message: user.dashboards,
            timestamp: new Date().toISOString()
        };
    }

    async editDashbaord(token: string, dashboardID: string, name: string, graphs: { graphName: string, endpointName: string, filters: string[], comments: [{ userName: string; comment: string; }] }[]) {
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
        if (!name || name.length == 0) {
            return {
                status: 400, error: true, message: 'Please enter a valid dashboard name.',
                timestamp: new Date().toISOString()
            };
        }

        let check = false;
        for (const dashboards of user.dashboards) {
            if (dashboards.dashboardID == dashboardID) {
                check = true;
            }
        }

        if (check == true) {
            for (const dashboards of user.dashboards) {
                if (dashboards.dashboardID == dashboardID) {
                    dashboards.graphs = graphs;
                    await this.dashboardRepository.save(dashboards);
                    await this.redis.set(token, JSON.stringify(user))
                    delete user.salt;
                    delete user.apiKey;
                    return {
                        status: "success",
                        message: user.dashboards,
                        timestamp: new Date().toISOString()
                    };
                }
            }
        } else {
            return {
                status: 400, error: true, message: 'User does not have a dashboard with this name.',
                timestamp: new Date().toISOString()
            };
        }
    }

    async shareDashboards(token: string, userGroupName: string, dashboardID: string) {
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

        let check = false;
        for (const userGroups of user.userGroups) {
            if (userGroups.name == userGroupName) {
                check = true;
            }
        }

        let dashboard = new Dashboard();
        for(const userDashboard of user.dashboards){
            if(userDashboard.dashboardID == dashboardID){
                dashboard = userDashboard;
            }else{
                return {
                    status: 400, error: true, message: 'Dashboard does not exsit.',
                    timestamp: new Date().toISOString()
                };
            }
        }

        if (check == true) {
            if (user.userGroups !== null) {
                for (const userGroup of user.userGroups) {
                    const userGroupUsers = await this.userGroupRepository.findOne({ where: { name: userGroup.name }, relations: ['users'] });
                    if (userGroupUsers.name == userGroupName) {
                        for (const groupUser of userGroupUsers.users) {
                            if (!Array.isArray(groupUser.dashboards)) {
                                groupUser.dashboards = [];
                            }
                            groupUser.dashboards.push(dashboard);
                            await this.userRepository.save(groupUser);
                        }
                    }
                }
            }
            return {
                status: "success",
                message: "shared dashboard",
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                status: 400, error: true, message: 'This user is not apart of the user group.',
                timestamp: new Date().toISOString()
            };
        }
    }

    async addCommentToGraph(token: string, dashboardID: string, graphName: string, comment: string) {
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
        if (!dashboardID || dashboardID.length == 0) {
            return {
                status: 400, error: true, message: 'Please enter a valid dashboard id.',
                timestamp: new Date().toISOString()
            };
        }

        let check = false;
        for (const dashboards of user.dashboards) {
            if (dashboards.dashboardID == dashboardID) {
                for (const graphs of dashboards.graphs) {
                    if (graphs.graphName == graphName) {
                        check = true;
                    }
                }
            }
        }

        if (check == true) {
            for (const dashboards of user.dashboards) {
                if (dashboards.dashboardID == dashboardID) {
                    for (const graphs of dashboards.graphs) {
                        if (graphs.graphName == graphName) {
                            const userName = user.firstName + " " + user.lastName;
                            if (!graphs.comments) {
                                graphs.comments = [];
                            }
                            graphs.comments.push({ userName, comment });
                            await this.dashboardRepository.save(dashboards);
                            await this.redis.set(token, JSON.stringify(user))
                            delete user.salt;
                            delete user.apiKey;
                            return {
                                status: "success",
                                message: user.dashboards,
                                timestamp: new Date().toISOString()
                            };
                        }
                    }
                }
            }
        } else {
            return {
                status: 400, error: true, message: 'User does not have a dashboard with this name.',
                timestamp: new Date().toISOString()
            };
        }
    }
}