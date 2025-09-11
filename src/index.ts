#!/usr/bin/env node

import { ZeekyCore } from '@/core/ZeekyCore';
import { Logger } from '@/utils/Logger';
import { Config } from '@/utils/Config';
import { SecurityManager } from '@/security/SecurityManager';
import { PluginManager } from '@/core/PluginManager';
import { AIManager } from '@/ai/AIManager';
import { IntegrationManager } from '@/integrations/IntegrationManager';

/**
 * Zeeky - All-in-One AI Assistant
 * Main entry point for the Zeeky system
 */
class ZeekyApplication {
  private core: ZeekyCore;
  private logger: Logger;
  private config: Config;
  private securityManager: SecurityManager;
  private pluginManager: PluginManager;
  private aiManager: AIManager;
  private integrationManager: IntegrationManager;

  constructor() {
    this.logger = new Logger('ZeekyApplication');
    this.config = new Config();
    this.securityManager = new SecurityManager();
    this.pluginManager = new PluginManager();
    this.aiManager = new AIManager();
    this.integrationManager = new IntegrationManager();
    this.core = new ZeekyCore({
      config: this.config,
      securityManager: this.securityManager,
      pluginManager: this.pluginManager,
      aiManager: this.aiManager,
      integrationManager: this.integrationManager
    });
  }

  /**
   * Initialize and start the Zeeky application
   */
  async start(): Promise<void> {
    try {
      this.logger.info('Starting Zeeky AI Assistant...');
      
      // Initialize security first
      await this.securityManager.initialize();
      this.logger.info('Security manager initialized');

      // Initialize AI layer
      await this.aiManager.initialize();
      this.logger.info('AI manager initialized');

      // Initialize integration layer
      await this.integrationManager.initialize();
      this.logger.info('Integration manager initialized');

      // Initialize plugin system
      await this.pluginManager.initialize();
      this.logger.info('Plugin manager initialized');

      // Initialize core system
      await this.core.initialize();
      this.logger.info('Core system initialized');

      // Start the system
      await this.core.start();
      this.logger.info('Zeeky AI Assistant started successfully');

      // Setup graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      this.logger.error('Failed to start Zeeky application:', error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.logger.info(`Received ${signal}, shutting down gracefully...`);
      
      try {
        await this.core.stop();
        await this.pluginManager.cleanup();
        await this.integrationManager.cleanup();
        await this.aiManager.cleanup();
        await this.securityManager.cleanup();
        
        this.logger.info('Zeeky application stopped successfully');
        process.exit(0);
      } catch (error) {
        this.logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // nodemon restart
  }
}

// Start the application
const app = new ZeekyApplication();
app.start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

export default ZeekyApplication;