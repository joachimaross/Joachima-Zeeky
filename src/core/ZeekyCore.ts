import { EventEmitter } from 'events';
import { Logger } from '@/utils/Logger';
import { Config } from '@/utils/Config';
import { SecurityManager } from '@/security/SecurityManager';
import { PluginManager } from './PluginManager';
import { AIManager } from '@/ai/AIManager';
import { IntegrationManager } from '@/integrations/IntegrationManager';
import { IntentRouter } from './IntentRouter';
import { ContextManager } from './ContextManager';
import { MemoryManager } from './MemoryManager';
import { FeatureRegistry } from './FeatureRegistry';
import { WebServer } from './WebServer';
import { WebSocketServer } from './WebSocketServer';
import { PluginRegistry } from './PluginRegistry';
import { VoiceProcessor } from '../voice/VoiceProcessor';
import { 
  ZeekyConfig, 
  ZeekyRequest, 
  ZeekyResponse,
  SystemStatus,
  HealthStatus
} from '@/types/ZeekyTypes';

/**
 * Zeeky Core - Master Orchestrator
 * Central system that coordinates all components
 */
export class ZeekyCore extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private securityManager: SecurityManager;
  private pluginManager: PluginManager;
  private pluginRegistry: PluginRegistry;
  private aiManager: AIManager;
  private integrationManager: IntegrationManager;
  private intentRouter: IntentRouter;
  private contextManager: ContextManager;
  private memoryManager: MemoryManager;
  private featureRegistry: FeatureRegistry;
  private webServer: WebServer;
  private webSocketServer: WebSocketServer;
  private voiceProcessor: VoiceProcessor;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;

  constructor(config: ZeekyConfig) {
    super();
    
    this.logger = new Logger('ZeekyCore');
    this.config = config.config;
    this.securityManager = config.securityManager;
    this.pluginManager = config.pluginManager;
    this.aiManager = config.aiManager;
    this.integrationManager = config.integrationManager;
    
    // Initialize core components
    this.pluginRegistry = new PluginRegistry(this.logger, this.config);
    this.intentRouter = new IntentRouter();
    this.contextManager = new ContextManager();
    this.memoryManager = new MemoryManager();
    this.featureRegistry = new FeatureRegistry();
    this.webServer = new WebServer();
    this.webSocketServer = new WebSocketServer();
    this.voiceProcessor = new VoiceProcessor(this.logger, this.config);
  }

  /**
   * Initialize the Zeeky core system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Core system already initialized');
      return;
    }

    try {
      this.logger.info('Initializing Zeeky core system...');

      // Initialize core components
      await this.pluginRegistry.initialize();
      await this.voiceProcessor.initialize();
      await this.featureRegistry.initialize();
      await this.memoryManager.initialize();
      await this.contextManager.initialize();
      await this.intentRouter.initialize();
      
      // Initialize web servers
      await this.webServer.initialize();
      await this.webSocketServer.initialize();

      // Setup event handlers
      this.setupEventHandlers();

      this.isInitialized = true;
      this.logger.info('Zeeky core system initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize core system:', error);
      throw error;
    }
  }

  /**
   * Start the Zeeky core system
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Core system must be initialized before starting');
    }

    if (this.isRunning) {
      this.logger.warn('Core system already running');
      return;
    }

    try {
      this.logger.info('Starting Zeeky core system...');

      // Start core components
      await this.memoryManager.start();
      await this.contextManager.start();
      await this.intentRouter.start();
      
      // Start web servers
      await this.webServer.start();
      await this.webSocketServer.start();

      // Load initial plugins
      await this.pluginManager.loadPlugins();

      this.isRunning = true;
      this.logger.info('Zeeky core system started successfully');

      // Emit system started event
      this.emit('system:started');

    } catch (error) {
      this.logger.error('Failed to start core system:', error);
      throw error;
    }
  }

  /**
   * Stop the Zeeky core system
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Core system not running');
      return;
    }

    try {
      this.logger.info('Stopping Zeeky core system...');

      // Stop web servers
      await this.webSocketServer.stop();
      await this.webServer.stop();

      // Stop core components
      await this.intentRouter.stop();
      await this.contextManager.stop();
      await this.memoryManager.stop();

      this.isRunning = false;
      this.logger.info('Zeeky core system stopped successfully');

      // Emit system stopped event
      this.emit('system:stopped');

    } catch (error) {
      this.logger.error('Failed to stop core system:', error);
      throw error;
    }
  }

  /**
   * Process a user request
   */
  async processRequest(request: ZeekyRequest): Promise<ZeekyResponse> {
    if (!this.isRunning) {
      throw new Error('Core system not running');
    }

    try {
      this.logger.debug('Processing request:', request);

      // Validate request
      await this.securityManager.validateRequest(request);

      // Create execution context
      const context = await this.contextManager.createContext(request);

      // Route intent
      const intent = await this.intentRouter.routeIntent(request, context);

      // Execute intent
      const response = await this.intentRouter.executeIntent(intent, context);

      // Update context
      await this.contextManager.updateContext(context, response);

      // Store in memory
      await this.memoryManager.storeInteraction(request, response);

      this.logger.debug('Request processed successfully:', response);
      return response;

    } catch (error) {
      this.logger.error('Failed to process request:', error);
      throw error;
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<SystemStatus> {
    const status: SystemStatus = {
      isRunning: this.isRunning,
      isInitialized: this.isInitialized,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      plugins: await this.pluginManager.getPluginStatus(),
      features: await this.featureRegistry.getFeatureCount(),
      integrations: await this.integrationManager.getIntegrationStatus(),
      ai: await this.aiManager.getAIStatus(),
      security: await this.securityManager.getSecurityStatus()
    };

    return status;
  }

  /**
   * Get health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const health: HealthStatus = {
      status: 'healthy',
      timestamp: new Date(),
      components: {
        core: this.isRunning ? 'healthy' : 'unhealthy',
        plugins: await this.pluginManager.getHealthStatus(),
        integrations: await this.integrationManager.getHealthStatus(),
        ai: await this.aiManager.getHealthStatus(),
        security: await this.securityManager.getHealthStatus()
      },
      metrics: {
        responseTime: await this.getAverageResponseTime(),
        errorRate: await this.getErrorRate(),
        activeConnections: await this.webSocketServer.getActiveConnections()
      }
    };

    return health;
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // Plugin events
    this.pluginManager.on('plugin:loaded', (plugin) => {
      this.logger.info(`Plugin loaded: ${plugin.id}`);
      this.featureRegistry.registerPlugin(plugin);
    });

    this.pluginManager.on('plugin:unloaded', (pluginId) => {
      this.logger.info(`Plugin unloaded: ${pluginId}`);
      this.featureRegistry.unregisterPlugin(pluginId);
    });

    // AI events
    this.aiManager.on('ai:model:updated', (model) => {
      this.logger.info(`AI model updated: ${model.id}`);
    });

    // Integration events
    this.integrationManager.on('integration:connected', (integration) => {
      this.logger.info(`Integration connected: ${integration.id}`);
    });

    this.integrationManager.on('integration:disconnected', (integrationId) => {
      this.logger.info(`Integration disconnected: ${integrationId}`);
    });

    // Security events
    this.securityManager.on('security:threat:detected', (threat) => {
      this.logger.warn(`Security threat detected: ${threat.type}`);
      this.emit('security:threat', threat);
    });
  }

  /**
   * Get average response time
   */
  private async getAverageResponseTime(): Promise<number> {
    // Implementation would track response times
    return 150; // ms
  }

  /**
   * Get error rate
   */
  private async getErrorRate(): Promise<number> {
    // Implementation would track error rates
    return 0.01; // 1%
  }
}