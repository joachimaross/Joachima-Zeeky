import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "@/utils";
import {
  ConfigService,
  ContextManager,
  FeatureRegistry,
  IntentRouter,
  AIManager,
  AppLifecycleManager,
  IntegrationManager,
} from "@/services";
import { Core } from "@/core/Core";
import { PluginManager } from "@/core/PluginManager";
import { SecurityManager } from "@/security/SecurityManager";
import { ILifecycleService } from "@/interfaces";

// Register services
container.register<Logger>(Logger, { useClass: Logger });
container.register<ConfigService>(ConfigService, { useClass: ConfigService });
container.register<ContextManager>(ContextManager, {
  useClass: ContextManager,
});
container.register<FeatureRegistry>(FeatureRegistry, {
  useClass: FeatureRegistry,
});
container.register<IntentRouter>(IntentRouter, { useClass: IntentRouter });
container.register<AIManager>(AIManager, { useClass: AIManager });
container.register<AppLifecycleManager>(AppLifecycleManager, {
  useClass: AppLifecycleManager,
});
container.register<IntegrationManager>(IntegrationManager, {
  useClass: IntegrationManager,
});
container.register<PluginManager>(PluginManager, { useClass: PluginManager });
container.register<SecurityManager>(SecurityManager, {
  useClass: SecurityManager,
});
container.register<Core>(Core, { useClass: Core });

// Register lifecycle services
container.register<ILifecycleService>("ILifecycleService", {
  useClass: AIManager,
});

export class ZeekyApplication {
  private logger: Logger;

  constructor() {
    this.logger = container.resolve(Logger);
  }

  public async start(): Promise<void> {
    try {
      this.logger.info("Starting Zeeky AI Assistant...");

      // Initialize configuration
      const configService = container.resolve(ConfigService);
      await configService.load();
      this.logger.info("Configuration loaded and validated");

      // Initialize and start all services
      const lifecycleManager = container.resolve(AppLifecycleManager);
      await lifecycleManager.start();

      this.logger.info("Zeeky AI Assistant started successfully");

      this.setupGracefulShutdown();
    } catch (error) {
      this.logger.error("Failed to start Zeeky application:", error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.logger.info(`Received ${signal}, shutting down gracefully...`);
      const lifecycleManager = container.resolve(AppLifecycleManager);
      try {
        await lifecycleManager.stop();
        this.logger.info("Zeeky application stopped successfully");
        process.exit(0);
      } catch (error) {
        this.logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
}
