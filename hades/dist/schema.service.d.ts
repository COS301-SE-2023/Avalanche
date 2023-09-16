export declare class SchemaService {
    private ajv;
    private schemas;
    constructor();
    private loadSchemas;
    private watchForSchemaChanges;
    getSchemaByUrl(url: string): any;
}
