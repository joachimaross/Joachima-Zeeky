import { container } from 'tsyringe';
import { Core } from '@/core/Core';
import { Logger } from '@/utils/Logger';

const logger = new Logger();

/**
 * Manages the application lifecycle, including startup, shutdown, and error handling.
 */
export class AppLifecycleManager {
  private core: Core;

  constructor() {
    this.core = container.resolve(Core);
  }

  /**
   * Starts the application.
   */
  public async start(): Promise<void> {
    try {
      logger.info('Starting Zeeky Core...');
      await this.core.initialize();
      logger.info('Zeeky Core started successfully.');
    } catch (error: any) {
      logger.error('Failed to start Zeeky Core:', error);
      process.exit(1);
    }
  }

  /**
   * Stops the application gracefully.
   */
  public async stop(): Promise<void> {
    try {
      logger.info('Stopping Zeeky Core...');
      await this.core.cleanup();
      logger.info('Zeeky Core stopped successfully.');
      process.exit(0);
    } catch (error: any) {
      logger.error('Failed to stop Zeeky Core gracefully:', error);
      process.exit(1);
    }
  }

  /**
   * Handles unhandled promise rejections.
   * @param reason The reason for the rejection.
   * @param promise The promise that was rejected.
   */
  public handleRejection(reason: any, promise: Promise<any>): void {
    logger.error('Unhandled Promise Rejection:', { reason, promise });
  }

  /**
   * Handles uncaught exceptions.
   * @param error The uncaught exception.
   */
  public handleException(error: Error): void {
    logger.error('Uncaught Exception:', error);
    this.stop();
  }
}
