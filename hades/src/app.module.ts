import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SchemaService } from './schema.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SchemaService],
})
export class AppModule {}
