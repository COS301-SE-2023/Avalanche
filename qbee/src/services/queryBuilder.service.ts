import { Inject, Injectable } from '@nestjs/common';
import { JSONQuery } from '../interfaces/JSONQuery';
import { PermissionsService } from './permission.service';
import { SQLTranslatorService } from './sqlTranslator.service';
import Redis from 'ioredis';
import { SchemaService } from './schema.service';

@Injectable()
export class QueryBuilderService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly sqlTranslator: SQLTranslatorService,
    private readonly schemaService: SchemaService, 
  ) {}

  async constructQuery(query: JSONQuery, token: string, schema: string, dataSource: string): Promise<any> {
    //First check permissions
    const user = await this.redis.get(token);
    const userDetails = JSON.parse(user);
    if(dataSource == 'zacr'){
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
    
    // Validate user access against the schema
    const hasAccess = this.schemaService.validateUserAccess(permissionsForDataSource[0].tou, query, schemaDetail);  // Assuming permission has the required info
    
    if (!hasAccess) {
      return {
        status: 403,
        error: true,
        message: 'User does not have access to this schema',
        timestamp: new Date().toISOString(),
      };
    }


    //Build SQL query
    const SQLquery = this.sqlTranslator.generateSQL(query);
    return SQLquery;
  }
}
