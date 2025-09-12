"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationManager = void 0;
const tsyringe_1 = require("tsyringe");
let IntegrationManager = class IntegrationManager {
    constructor() {
        this.integrations = new Map();
    }
    register(integration) {
        this.integrations.set(integration.name, integration);
    }
    async start() {
        for (const integration of this.integrations.values()) {
            await integration.initialize();
        }
    }
    async stop() {
        for (const integration of this.integrations.values()) {
            await integration.cleanup();
        }
    }
    get(name) {
        const integration = this.integrations.get(name);
        return integration?.getClient();
    }
};
exports.IntegrationManager = IntegrationManager;
exports.IntegrationManager = IntegrationManager = __decorate([
    (0, tsyringe_1.singleton)()
], IntegrationManager);
//# sourceMappingURL=IntegrationManager.js.map