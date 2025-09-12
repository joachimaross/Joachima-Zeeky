"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const tsyringe_1 = require("tsyringe");
let ContextManager = class ContextManager {
    constructor() {
        this.context = new Map();
    }
    set(key, value) {
        this.context.set(key, value);
    }
    get(key) {
        return this.context.get(key);
    }
    has(key) {
        return this.context.has(key);
    }
    delete(key) {
        return this.context.delete(key);
    }
    clear() {
        this.context.clear();
    }
};
exports.ContextManager = ContextManager;
exports.ContextManager = ContextManager = __decorate([
    (0, tsyringe_1.singleton)()
], ContextManager);
//# sourceMappingURL=ContextManager.js.map