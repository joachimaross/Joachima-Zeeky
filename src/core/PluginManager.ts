import { EventEmitter } from 'events';
import { Logger } from '@/utils/Logger';
import { Config } from '@/utils/Config';
import { ZeekyPlugin } from '@/types/ZeekyTypes';

/**
 * Plugin Manager for Zeeky
 * Handles plugin loading, registration, and lifecycle management
 */
export class PluginManager extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private plugins: Map<string, ZeekyPlugin> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.logger = new Logger('PluginManager');
    this.config = new Config();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Plugin manager already initialized');
      return;
    }

    try {
      this.logger.info('Initializing Plugin Manager...');

      // Initialize plugin registry
      await this.initializePluginRegistry();

      this.isInitialized = true;
      this.logger.info('Plugin Manager initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Plugin Manager:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up Plugin Manager...');
    
    // Cleanup all plugins
    for (const [pluginId, plugin] of this.plugins) {
      try {
        await plugin.cleanup();
        this.logger.info(`Plugin ${pluginId} cleaned up successfully`);
      } catch (error) {
        this.logger.error(`Failed to cleanup plugin ${pluginId}:`, error);
      }
    }

    this.plugins.clear();
    this.isInitialized = false;
  }

  async loadPlugins(): Promise<void> {
    this.logger.info('Loading plugins...');

    try {
      // Load built-in plugins
      await this.loadBuiltInPlugins();

      // Load external plugins
      await this.loadExternalPlugins();

      this.logger.info(`Loaded ${this.plugins.size} plugins successfully`);

    } catch (error) {
      this.logger.error('Failed to load plugins:', error);
      throw error;
    }
  }

  async registerPlugin(plugin: ZeekyPlugin): Promise<void> {
    try {
      this.logger.info(`Registering plugin: ${plugin.id}`);

      // Validate plugin
      if (!this.validatePlugin(plugin)) {
        throw new Error(`Invalid plugin: ${plugin.id}`);
      }

      // Check for conflicts
      if (this.plugins.has(plugin.id)) {
        throw new Error(`Plugin ${plugin.id} is already registered`);
      }

      // Initialize plugin
      const context = await this.createPluginContext();
      await plugin.initialize(context);

      // Register plugin
      this.plugins.set(plugin.id, plugin);

      this.emit('plugin:loaded', plugin);
      this.logger.info(`Plugin ${plugin.id} registered successfully`);

    } catch (error) {
      this.logger.error(`Failed to register plugin ${plugin.id}:`, error);
      throw error;
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    try {
      const plugin = this.plugins.get(pluginId);
      if (!plugin) {
        this.logger.warn(`Plugin ${pluginId} not found`);
        return;
      }

      this.logger.info(`Unregistering plugin: ${pluginId}`);

      // Cleanup plugin
      await plugin.cleanup();

      // Remove from registry
      this.plugins.delete(pluginId);

      this.emit('plugin:unloaded', pluginId);
      this.logger.info(`Plugin ${pluginId} unregistered successfully`);

    } catch (error) {
      this.logger.error(`Failed to unregister plugin ${pluginId}:`, error);
      throw error;
    }
  }

  getPlugin(pluginId: string): ZeekyPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): ZeekyPlugin[] {
    return Array.from(this.plugins.values());
  }

  async getPluginStatus(): Promise<any[]> {
    const status = [];
    for (const [pluginId, plugin] of this.plugins) {
      try {
        const healthStatus = plugin.getHealthStatus();
        status.push({
          id: pluginId,
          name: plugin.name,
          version: plugin.version,
          status: healthStatus.status,
          lastCheck: healthStatus.lastCheck
        });
      } catch (error) {
        status.push({
          id: pluginId,
          name: plugin.name,
          version: plugin.version,
          status: 'error',
          error: error.message
        });
      }
    }
    return status;
  }

  async getHealthStatus(): Promise<string> {
    if (!this.isInitialized) {
      return 'unhealthy';
    }

    let healthyCount = 0;
    for (const plugin of this.plugins.values()) {
      try {
        const health = plugin.getHealthStatus();
        if (health.status === 'healthy') {
          healthyCount++;
        }
      } catch (error) {
        // Plugin is unhealthy
      }
    }

    const totalPlugins = this.plugins.size;
    if (totalPlugins === 0) {
      return 'healthy'; // No plugins is considered healthy
    }

    const healthRatio = healthyCount / totalPlugins;
    if (healthRatio >= 0.8) {
      return 'healthy';
    } else if (healthRatio >= 0.5) {
      return 'degraded';
    } else {
      return 'unhealthy';
    }
  }

  private async initializePluginRegistry(): Promise<void> {
    this.logger.info('Initializing plugin registry...');
    // Plugin registry initialization logic
  }

  private async loadBuiltInPlugins(): Promise<void> {
    this.logger.info('Loading built-in plugins...');
    
    try {
      // Import and register built-in plugins
      const { ProductivityPlugin } = await import('@/plugins/example/ProductivityPlugin');
      const { CreativePlugin } = await import('@/plugins/example/CreativePlugin');
      const { SmartHomePlugin } = await import('@/plugins/example/SmartHomePlugin');

      await this.registerPlugin(new ProductivityPlugin());
      await this.registerPlugin(new CreativePlugin());
      await this.registerPlugin(new SmartHomePlugin());

    } catch (error) {
      this.logger.error('Failed to load built-in plugins:', error);
      throw error;
    }
  }

  private async loadExternalPlugins(): Promise<void> {
    this.logger.info('Loading external plugins...');
    // External plugin loading logic would go here
  }

  private validatePlugin(plugin: ZeekyPlugin): boolean {
    // Basic plugin validation
    if (!plugin.id || !plugin.name || !plugin.version) {
      return false;
    }

    if (!plugin.initialize || !plugin.handleIntent || !plugin.cleanup) {
      return false;
    }

    return true;
  }

  private async createPluginContext(): Promise<any> {
    // Create plugin context with all necessary services
    return {
      system: {
        version: '1.0.0',
        environment: this.config.get('NODE_ENV')
      },
      user: {
        id: 'system',
        profile: {},
        preferences: {},
        permissions: [],
        roles: []
      },
      device: {
        id: 'system',
        type: 'server',
        capabilities: [],
        sensors: [],
        status: 'active'
      },
      services: {},
      storage: {
        get: async (_key: string) => null,
        set: async (_key: string, _value: any) => {},
        delete: async (_key: string) => {}
      },
      network: {},
      security: {},
      ai: {},
      voice: {},
      vision: {},
      integrations: {},
      home: {},
      vehicle: {},
      enterprise: {},
      config: {},
      features: {},
      metrics: {},
      logging: this.logger,
      analytics: {}
    };
  }
}