import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';

/**
 * Context Manager
 * Manages conversation and session context
 */
export class ContextManager extends EventEmitter {
  private logger: Logger;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private contexts: Map<string, any> = new Map();

  constructor() {
    super();
    this.logger = new Logger('ContextManager');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Context manager already initialized');
      return;
    }

    this.logger.info('Initializing context manager...');
    this.isInitialized = true;
    this.logger.info('Context manager initialized successfully');
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Context manager must be initialized before starting');
    }

    if (this.isRunning) {
      this.logger.warn('Context manager already running');
      return;
    }

    this.logger.info('Starting context manager...');
    this.isRunning = true;
    this.logger.info('Context manager started successfully');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Context manager not running');
      return;
    }

    this.logger.info('Stopping context manager...');
    this.isRunning = false;
    this.contexts.clear();
    this.logger.info('Context manager stopped successfully');
  }

  async createContext(request: any): Promise<any> {
    this.logger.debug('Creating context for request:', request.id);
    
    const context = {
      requestId: request.id,
      userId: request.userId,
      sessionId: request.sessionId,
      timestamp: new Date(),
      source: request.source,
      device: { id: request.deviceId },
      location: {},
      permissions: [],
      securityLevel: 'medium',
      auditTrail: [],
    };

    this.contexts.set(request.id, context);
    return context;
  }

  async updateContext(context: any, response: any): Promise<void> {
    this.logger.debug('Updating context:', context.requestId);
    
    if (this.contexts.has(context.requestId)) {
      const existingContext = this.contexts.get(context.requestId);
      existingContext.lastResponse = response;
      existingContext.updatedAt = new Date();
      this.contexts.set(context.requestId, existingContext);
    }
  }

  getContext(requestId: string): any {
    return this.contexts.get(requestId);
  }

  getAllContexts(): Map<string, any> {
    return new Map(this.contexts);
  }
}