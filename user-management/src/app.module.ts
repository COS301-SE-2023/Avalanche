/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthService } from './services/auth/auth.service';
import { RedisProvider } from './redis.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserGroup } from './entity/userGroup.entity';
import { Organisation } from './entity/organisation.entity';
import { UserOrganisationMangementService } from './services/user-organisation/user-organisation-mangement.service';
import { UserDataProductMangementService } from './services//user-data-products/user-data-products-management.service';
import { UserUserGroupMangementService } from './services/user-userGroup/user-userGroup-management.service';
import { UserDashboardMangementService } from './services/user-dashboard/user-dashboard-management.service';
import { Dashboard } from './entity/dashboard.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_MANAGEMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'), 
          signOptions: { expiresIn: '24h' },
        } as JwtModuleOptions;
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, UserGroup, Organisation, Dashboard], // We change entities to an array that includes the User entity. 
        synchronize: true,
      }),
      inject: [ConfigService],
    }), 
    TypeOrmModule.forFeature([User, UserGroup, Organisation, Dashboard]),
  ],
  controllers: [AppController],
  providers: [AuthService, RedisProvider, UserOrganisationMangementService, UserDataProductMangementService, UserUserGroupMangementService, UserDashboardMangementService],
  exports: [AuthService, UserOrganisationMangementService, UserDataProductMangementService, UserUserGroupMangementService, UserDashboardMangementService],
})
export class AppModule {}

