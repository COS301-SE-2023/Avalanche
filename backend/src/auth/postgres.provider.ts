/* eslint-disable prettier/prettier */
import { Provider } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const PostgresProvider: Provider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const dbHost = configService.get('POSTGRES_HOST');
    const dbPort = configService.get<number>('POSTGRES_PORT');
    const dbUsername = configService.get('POSTGRES_USER');
    const dbPassword = configService.get('POSTGRES_PASSWORD');
    const dbName = configService.get('POSTGRES_DB');
    console.log(dbHost);
    if (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbName) {
      throw new Error('One or more database environment variables are not set');
    }

    return await createConnection({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbName,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    });
  },
  inject: [ConfigService],
};
