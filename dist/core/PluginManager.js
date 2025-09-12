"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
const tsyringe_1 = require("tsyringe");
let PluginManager = class PluginManager {
    constructor() {
        this.plugins = [];
    }
    async start() {
        await this.loadPlugins();
    }
    async stop() {
        for (const plugin of this.plugins) {
            await plugin.cleanup();
        }
    }
    async loadPlugins() {
    }
};
exports.PluginManager = PluginManager;
exports.PluginManager = PluginManager = __decorate([
    (0, tsyringe_1.singleton)()
], PluginManager);
//# sourceMappingURL=PluginManager.js.map