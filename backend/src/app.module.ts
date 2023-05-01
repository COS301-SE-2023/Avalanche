import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SnowflakeController } from './snowflake/snowflake.controller';
import { AppService } from './app.service';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { AuthModule } from './security/auth.module';

@Module({
  imports: [SnowflakeModule, AuthModule],
  controllers: [AppController, SnowflakeController],
  providers: [AppService],
})
export class AppModule {}
