import { singleton } from "tsyringe";
import { Core } from "@/core/Core";
import { Logger } from "@/utils/Logger";

@singleton()
export class AppLifecycleManager {
  constructor(
    private core: Core,
    private logger: Logger,
  ) {}

  public async start(): Promise<void> {
    try {
      this.logger.info("Starting Zeeky Core...");
      await this.core.initialize();
      this.logger.info("Zeeky Core started successfully.");
    } catch (error) {
      this.logger.error(
        "Failed to start Zeeky Core:",
        error instanceof Error ? error : new Error(String(error)),
      );
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      this.logger.info("Stopping Zeeky Core...");
      await this.core.cleanup();
      this.logger.info("Zeeky Core stopped successfully.");
      process.exit(0);
    } catch (error) {
      this.logger.error(
        "Failed to stop Zeeky Core gracefully:",
        error instanceof Error ? error : new Error(String(error)),
      );
      process.exit(1);
    }
  }

  public handleRejection(reason: unknown, promise: Promise<unknown>): void {
    this.logger.error("Unhandled Promise Rejection:", { reason, promise });
  }

  public handleException(error: Error): void {
    this.logger.error("Uncaught Exception:", error);
    this.stop();
  }
}
