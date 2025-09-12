"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLifecycleManager = void 0;
const tsyringe_1 = require("tsyringe");
const Core_1 = require("@/core/Core");
const Logger_1 = require("@/utils/Logger");
const logger = new Logger_1.Logger();
class AppLifecycleManager {
    constructor() {
        this.core = tsyringe_1.container.resolve(Core_1.Core);
    }
    async start() {
        try {
            logger.info('Starting Zeeky Core...');
            await this.core.initialize();
            logger.info('Zeeky Core started successfully.');
        }
        catch (error) {
            logger.error('Failed to start Zeeky Core:', error);
            process.exit(1);
        }
    }
    async stop() {
        try {
            logger.info('Stopping Zeeky Core...');
            await this.core.cleanup();
            logger.info('Zeeky Core stopped successfully.');
            process.exit(0);
        }
        catch (error) {
            logger.error('Failed to stop Zeeky Core gracefully:', error);
            process.exit(1);
        }
    }
    handleRejection(reason, promise) {
        logger.error('Unhandled Promise Rejection:', { reason, promise });
    }
    handleException(error) {
        logger.error('Uncaught Exception:', error);
        this.stop();
    }
}
exports.AppLifecycleManager = AppLifecycleManager;
//# sourceMappingURL=AppLifecycleManager.js.map