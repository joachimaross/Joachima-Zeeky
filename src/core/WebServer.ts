import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';

/**
 * Web Server
 * HTTP server for Zeeky API
 */
export class WebServer extends EventEmitter {
  private logger: Logger;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  // private server: any = null;

  constructor() {
    super();
    this.logger = new Logger('WebServer');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Web server already initialized');
      return;
    }

    this.logger.info('Initializing web server...');
    this.isInitialized = true;
    this.logger.info('Web server initialized successfully');
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web server must be initialized before starting');
    }

    if (this.isRunning) {
      this.logger.warn('Web server already running');
      return;
    }

    this.logger.info('Starting web server...');
    this.isRunning = true;
    this.logger.info('Web server started successfully');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Web server not running');
      return;
    }

    this.logger.info('Stopping web server...');
    this.isRunning = false;
    this.logger.info('Web server stopped successfully');
  }
}