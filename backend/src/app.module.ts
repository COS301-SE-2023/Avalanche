// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RediUserModule } from './redisUser/redisUser.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(), // import TypeOrmModule
    AuthModule, // import AuthModule
    UserModule, // import UserModule
    RediUserModule, // import RedisModule
  ],
  controllers: [], // No controller at root level
  providers: [], // No provider at root level
})
export class AppModule {}
