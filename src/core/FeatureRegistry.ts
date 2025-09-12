import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';

/**
 * Feature Registry
 * Manages feature registration and discovery
 */
export class FeatureRegistry extends EventEmitter {
  private logger: Logger;
  private isInitialized: boolean = false;
  private features: Map<string, any> = new Map();
  private plugins: Map<string, any> = new Map();

  constructor() {
    super();
    this.logger = new Logger('FeatureRegistry');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Feature registry already initialized');
      return;
    }

    this.logger.info('Initializing feature registry...');
    this.isInitialized = true;
    this.logger.info('Feature registry initialized successfully');
  }

  async registerPlugin(plugin: any): Promise<void> {
    this.logger.info(`Registering plugin: ${plugin.id}`);
    this.plugins.set(plugin.id, plugin);
    
    // Register plugin features
    if (plugin.intents) {
      for (const intent of plugin.intents) {
        this.features.set(intent.id, {
          ...intent,
          pluginId: plugin.id,
        });
      }
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    this.logger.info(`Unregistering plugin: ${pluginId}`);
    this.plugins.delete(pluginId);
    
    // Remove plugin features
    for (const [featureId, feature] of this.features.entries()) {
      if (feature.pluginId === pluginId) {
        this.features.delete(featureId);
      }
    }
  }

  async getFeatureCount(): Promise<number> {
    return this.features.size;
  }

  async getPluginCount(): Promise<number> {
    return this.plugins.size;
  }

  async getFeature(featureId: string): Promise<any> {
    return this.features.get(featureId);
  }

  async getPlugin(pluginId: string): Promise<any> {
    return this.plugins.get(pluginId);
  }

  async getAllFeatures(): Promise<Map<string, any>> {
    return new Map(this.features);
  }

  async getAllPlugins(): Promise<Map<string, any>> {
    return new Map(this.plugins);
  }
}