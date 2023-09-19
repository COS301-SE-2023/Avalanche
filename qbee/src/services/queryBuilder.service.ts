import { Injectable } from '@nestjs/common';
import { JSONQuery } from '../interfaces/JSONQuery';
import { PermissionsService } from './permission.service';
import { SQLTranslatorService } from './sqlTranslator.service';

@Injectable()
export class QueryBuilderService {
  constructor(
    private readonly sqlTranslator: SQLTranslatorService,
    private readonly permissions: PermissionsService,
  ) {}

  async constructQuery(data: JSONQuery, userObject: any): Promise<any> {
    //First check permissions
    const permission = this.permissions.checkColumnPermissions(
      data,
      userObject,
    );

    if (!permission) {
      return {
        status: 403,
        error: true,
        message: 'Insufficient permissions for constructed Query',
        timestamp: new Date().toISOString(),
      };
    }

    //Build SQL query
    const query = this.sqlTranslator.generateSQL(data);
    return query;
  }
}
