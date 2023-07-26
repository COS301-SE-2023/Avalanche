/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionFilterT } from './rpc-excpetion.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new ExceptionFilterT());
  await app.listen(4000);
}

bootstrap();