import { SchemaService } from './schema.service';
export declare class AppController {
    private readonly schemaService;
    constructor(schemaService: SchemaService);
    getSchemaByUrl(params: any): any;
}
