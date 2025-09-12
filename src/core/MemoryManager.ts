import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';

/**
 * Memory Manager
 * Manages user data and system memory
 */
export class MemoryManager extends EventEmitter {
  private logger: Logger;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private memory: Map<string, any> = new Map();

  constructor() {
    super();
    this.logger = new Logger('MemoryManager');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Memory manager already initialized');
      return;
    }

    this.logger.info('Initializing memory manager...');
    this.isInitialized = true;
    this.logger.info('Memory manager initialized successfully');
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Memory manager must be initialized before starting');
    }

    if (this.isRunning) {
      this.logger.warn('Memory manager already running');
      return;
    }

    this.logger.info('Starting memory manager...');
    this.isRunning = true;
    this.logger.info('Memory manager started successfully');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Memory manager not running');
      return;
    }

    this.logger.info('Stopping memory manager...');
    this.isRunning = false;
    this.memory.clear();
    this.logger.info('Memory manager stopped successfully');
  }

  async storeInteraction(request: any, response: any): Promise<void> {
    this.logger.debug('Storing interaction:', request.id);
    
    const interaction = {
      id: `${request.id}-${response.id}`,
      request,
      response,
      timestamp: new Date(),
    };

    this.memory.set(interaction.id, interaction);
  }

  async getInteraction(id: string): Promise<any> {
    return this.memory.get(id);
  }

  async getAllInteractions(): Promise<Map<string, any>> {
    return new Map(this.memory);
  }

  async clearMemory(): Promise<void> {
    this.logger.info('Clearing memory...');
    this.memory.clear();
  }
}