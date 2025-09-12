"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const ZeekyApplication_1 = require("@/ZeekyApplication");
const Logger_1 = require("@/utils/Logger");
async function bootstrap() {
    const app = tsyringe_1.container.resolve(ZeekyApplication_1.ZeekyApplication);
    try {
        await app.start();
    }
    catch (error) {
        const logger = tsyringe_1.container.resolve(Logger_1.Logger);
        logger.error('Unhandled exception during bootstrap:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=index.js.map