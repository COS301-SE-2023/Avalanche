import { Inject, Injectable } from '@nestjs/common';
import { JSONQuery } from '../interfaces/JSONQuery';
import Redis from 'ioredis';
import { SchemaService } from './schema.service';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly schemaService: SchemaService,
  ) { }

  async getSchema(token: string, schema: string, dataSource: string): Promise<any> {
    //First check permissions
    const user = await this.redis.get(token);
    const userDetails = JSON.parse(user);
    if (dataSource == 'zacr') {
      dataSource = 'zarc'
    }
    const permissionsForDataSource = userDetails.products.filter((product) => product.dataSource === dataSource);
    const schemaUrl = `/${dataSource}/${schema}`;
    const schemaDetail = this.schemaService.getSchemaByUrl(schemaUrl);

    if (!schemaDetail) {
      return {
        status: 404,
        error: true,
        message: 'Schema not found',
        timestamp: new Date().toISOString(),
      };
    }

    const newSchema = this.schemaService.transformSchemaForUser(permissionsForDataSource[0].tou, schemaDetail);
    return { status: "success", message: newSchema };
  }
}
