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
exports.Core = void 0;
const services_1 = require("@/services");
const PluginManager_1 = require("./PluginManager");
const SecurityManager_1 = require("../security/SecurityManager");
const utils_1 = require("@/utils");
const tsyringe_1 = require("tsyringe");
let Core = class Core {
    constructor(securityManager, aiManager, pluginManager, integrationManager, logger) {
        this.securityManager = securityManager;
        this.aiManager = aiManager;
        this.pluginManager = pluginManager;
        this.integrationManager = integrationManager;
        this.logger = logger;
    }
    async initialize() {
        this.logger.info('Initializing Zeeky Core...');
        await this.securityManager.start();
        await this.aiManager.start();
        await this.pluginManager.start();
        await this.integrationManager.start();
        this.logger.info('Zeeky Core initialized successfully');
    }
    async cleanup() {
        this.logger.info('Cleaning up Zeeky Core...');
        await this.integrationManager.stop();
        await this.pluginManager.stop();
        await this.aiManager.stop();
        await this.securityManager.stop();
        this.logger.info('Zeeky Core cleaned up successfully');
    }
};
exports.Core = Core;
exports.Core = Core = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [SecurityManager_1.SecurityManager,
        services_1.AIManager,
        PluginManager_1.PluginManager,
        services_1.IntegrationManager,
        utils_1.Logger])
], Core);
//# sourceMappingURL=Core.js.map