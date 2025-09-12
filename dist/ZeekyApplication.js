"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeekyApplication = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const utils_1 = require("@/utils");
const services_1 = require("@/services");
tsyringe_1.container.register(utils_1.Logger, { useClass: utils_1.Logger });
tsyringe_1.container.register(services_1.ConfigService, { useClass: services_1.ConfigService });
tsyringe_1.container.register(services_1.ContextManager, { useClass: services_1.ContextManager });
tsyringe_1.container.register(services_1.FeatureRegistry, { useClass: services_1.FeatureRegistry });
tsyringe_1.container.register(services_1.IntentRouter, { useClass: services_1.IntentRouter });
tsyringe_1.container.register(services_1.AIManager, { useClass: services_1.AIManager });
tsyringe_1.container.register(services_1.AppLifecycleManager, { useClass: services_1.AppLifecycleManager });
tsyringe_1.container.register('ILifecycleService', { useClass: services_1.AIManager });
class ZeekyApplication {
    constructor() {
        this.logger = tsyringe_1.container.resolve(utils_1.Logger);
    }
    async start() {
        try {
            this.logger.info('Starting Zeeky AI Assistant...');
            const configService = tsyringe_1.container.resolve(services_1.ConfigService);
            await configService.load();
            this.logger.info('Configuration loaded and validated');
            const lifecycleManager = tsyringe_1.container.resolve(services_1.AppLifecycleManager);
            await lifecycleManager.start();
            this.logger.info('Zeeky AI Assistant started successfully');
            this.setupGracefulShutdown();
        }
        catch (error) {
            this.logger.error('Failed to start Zeeky application:', error);
            process.exit(1);
        }
    }
    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            this.logger.info(`Received ${signal}, shutting down gracefully...`);
            const lifecycleManager = tsyringe_1.container.resolve(services_1.AppLifecycleManager);
            try {
                await lifecycleManager.stop();
                this.logger.info('Zeeky application stopped successfully');
                process.exit(0);
            }
            catch (error) {
                this.logger.error('Error during shutdown:', error);
                process.exit(1);
            }
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
}
exports.ZeekyApplication = ZeekyApplication;
//# sourceMappingURL=ZeekyApplication.js.map