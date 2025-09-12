import { singleton } from "tsyringe";
import { Core } from "@/core/Core";
import { Logger } from "@/utils/Logger";
import { container } from "tsyringe";

const logger = new Logger();

@singleton()
export class AppLifecycleManager {
  private core: Core;
  constructor() {
    this.core = container.resolve(Core);
  }

  public async start(): Promise<void> {
    try {
      logger.info("Starting Zeeky Core...");
      await this.core.initialize();
      logger.info("Zeeky Core started successfully.");
    } catch (error: any) {
      logger.error("Failed to start Zeeky Core:", error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      logger.info("Stopping Zeeky Core...");
      await this.core.cleanup();
      logger.info("Zeeky Core stopped successfully.");
      process.exit(0);
    } catch (error: any) {
      logger.error("Failed to stop Zeeky Core gracefully:", error);
      process.exit(1);
    }
  }

  public handleRejection(reason: any, promise: Promise<any>): void {
    logger.error("Unhandled Promise Rejection:", { reason, promise });
  }

  public handleException(error: Error): void {
    logger.error("Uncaught Exception:", error);
    this.stop();
  }
}
