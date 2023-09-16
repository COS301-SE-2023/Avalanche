import { Injectable } from '@nestjs/common';
import { JSONQuery } from '../interfaces/JSONQuery';

@Injectable()
export class PermissionsService {
  constructor() {}

  async checkColumnPermissions(queryPayload: JSONQuery, user: any) {
    console.debug(queryPayload + '' + user);
    return true;
  }
}
