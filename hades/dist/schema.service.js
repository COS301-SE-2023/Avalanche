"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaService = void 0;
const common_1 = require("@nestjs/common");
const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");
let SchemaService = exports.SchemaService = class SchemaService {
    constructor() {
        this.ajv = new Ajv();
        this.schemas = {};
        const projectRoot = path.resolve(__dirname, '../');
        console.log(projectRoot);
        const schemasDir = path.join(projectRoot, 'src/schemas');
        console.log(schemasDir);
        this.loadSchemas(schemasDir, '');
    }
    loadSchemas(dir, prefix) {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.resolve(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                this.loadSchemas(filePath, `${prefix}/${file}`);
            }
            else if (stats.isFile() && path.extname(file) === '.json') {
                const schema = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const url = `${prefix}/${path.basename(file, '.json')}`;
                this.schemas[url] = schema;
            }
        });
    }
    getSchemaByUrl(url) {
        const check = this.schemas[url];
        return this.schemas[url] || null;
    }
};
exports.SchemaService = SchemaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SchemaService);
//# sourceMappingURL=schema.service.js.map