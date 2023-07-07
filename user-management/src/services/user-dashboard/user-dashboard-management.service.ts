/* eslint-disable prettier/prettier */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import { UserGroup } from '../../entity/userGroup.entity';
import { Organisation } from '../../entity/organisation.entity';
import { Dashboard } from 'src/entity/dashboard.entity';
import { Graph } from 'src/entity/graph.entity';
@Injectable()
export class UserDashboardMangementService {
    constructor(@Inject('REDIS') private readonly redis: Redis, private readonly configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>,
        @InjectRepository(Organisation) private organisationRepository: Repository<Organisation>,
        @InjectRepository(Dashboard) private dashboardRepository: Repository<Dashboard>) { }

    async saveDashbaord(token: string, name: string, graphs : {name: string, filters: string[]}[]) {
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

        const dashboard = new Dashboard();
        dashboard.name = name;
        dashboard.graphs = graphs;
        await this.dashboardRepository.save(dashboard);

        user.dashboards.push(dashboard);
        await this.userRepository.save(user);

        await this.redis.set(token, JSON.stringify(user))
        delete user.salt;
        delete user.apiKey;

        return {
            status: "success", 
            message: user,
            timestamp: new Date().toISOString()
        };
    }
}