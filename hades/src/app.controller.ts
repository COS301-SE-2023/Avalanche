import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { SchemaService } from './schema.service';

@Controller()
export class AppController {
  constructor(private readonly schemaService: SchemaService) { }

  @Get(':url*')
  getSchemaByUrl(@Param() params: any) {
    // params.url will contain the entire path as a single string
    const url = "/" + params.url + params[0];
    const schema = this.schemaService.getSchemaByUrl(url);
    console.log(schema);
    if (!schema) {
      throw new NotFoundException(`Schema not found for URL ${url}`);
    }
    return schema;
  }

}
