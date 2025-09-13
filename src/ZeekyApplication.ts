import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "@/utils/Logger";
import { ConfigService } from "@/utils";
import { ContextManager } from "@/services/ContextManager";
import { FeatureRegistry } from "@/services/FeatureRegistry";
import { IntentRouter } from "@/services/IntentRouter";
import { AIManager } from "@/services/AIManager";
import { AppLifecycleManager } from "@/services/AppLifecycleManager";
import { IntegrationManager } from "@/services/IntegrationManager";
import { Core } from "@/core/Core";
import { PluginManager } from "@/core/PluginManager";
import { SecurityManager } from "@/security/SecurityManager";
import { ILifecycleService } from "@/interfaces";
import { WebServer } from "./web/WebServer";
import { GeminiService } from "@/services/GeminiService";
import { GeminiPlugin } from "@/plugins/ai/GeminiPlugin";
import { HealthAndFitnessPlugin } from "@/plugins/health/HealthAndFitnessPlugin";
import { CreativePlugin } from "@/plugins/CreativePlugin";
import { ProductivityPlugin } from "@/plugins/ProductivityPlugin";
import { SmartHomePlugin } from "@/plugins/SmartHomePlugin";
import express from "express";

// Register services with direct imports to prevent circular dependencies
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
container.register<WebServer>(WebServer, { useClass: WebServer });
container.register<GeminiService>(GeminiService, { useClass: GeminiService });
container.register<CreativePlugin>(CreativePlugin, {
  useClass: CreativePlugin,
});
container.register<ProductivityPlugin>(ProductivityPlugin, {
  useClass: ProductivityPlugin,
});
container.register<SmartHomePlugin>(SmartHomePlugin, {
  useClass: SmartHomePlugin,
});

// Register all services that implement the ILifecycleService interface
// This allows AppLifecycleManager to manage their start/stop cycles
container.register<ILifecycleService>("ILifecycleService", {
  useClass: AIManager,
});
container.register<ILifecycleService>("ILifecycleService", {
  useClass: IntegrationManager,
});
// Add other lifecycle services here as needed

export class ZeekyApplication {
  private logger: Logger;

  constructor() {
    this.logger = container.resolve(Logger);
  }

  public getExpressApp(): express.Application {
    const webServer = container.resolve(WebServer);
    return webServer.getApp();
  }

  public async start(): Promise<void> {
    try {
      this.logger.info("Starting Zeeky AI Assistant...");

      // Initialize configuration
      const configService = container.resolve(ConfigService);
      await configService.load();
      this.logger.info("Configuration loaded and validated");

      // Register plugins
      const pluginManager = container.resolve(PluginManager);
      pluginManager.register(container.resolve(GeminiPlugin));
      pluginManager.register(container.resolve(HealthAndFitnessPlugin));
      pluginManager.register(container.resolve(CreativePlugin));
      pluginManager.register(container.resolve(ProductivityPlugin));
      pluginManager.register(container.resolve(SmartHomePlugin));
      this.logger.info("Plugins registered");

      // Start all registered lifecycle services
      const lifecycleManager = container.resolve(AppLifecycleManager);
      await lifecycleManager.start();

      // Start the web server
      const webServer = container.resolve(WebServer);
      const port = configService.get<number>("web.port") ?? 3000;
      webServer.start(port);

      this.logger.info("Zeeky AI Assistant started successfully");

      this.setupGracefulShutdown();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to start Zeeky application: ${error.message}`,
        );
        this.logger.error(`Stack: ${error.stack}`);
      } else {
        this.logger.error(
          `Failed to start Zeeky application with an unknown error: ${error}`,
        );
      }
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
        if (error instanceof Error) {
          this.logger.error(`Error during shutdown: ${error.message}`);
        } else {
          this.logger.error(
            `Error during shutdown with an unknown error: ${error}`,
          );
        }
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
}
