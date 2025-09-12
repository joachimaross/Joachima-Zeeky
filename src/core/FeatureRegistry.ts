import { Logger } from '@/utils/Logger';

/**
 * Feature Registry for Zeeky
 * Manages feature registration and discovery
 */
export class FeatureRegistry {
  private logger: Logger;
  private features: Map<string, any> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.logger = new Logger('FeatureRegistry');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Feature registry already initialized');
      return;
    }

    try {
      this.logger.info('Initializing Feature Registry...');
      this.isInitialized = true;
      this.logger.info('Feature Registry initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Feature Registry:', error);
      throw error;
    }
  }

  async registerPlugin(plugin: any): Promise<void> {
    try {
      this.logger.info('Registering plugin features:', { pluginId: plugin.id });
      
      // Register plugin features
      if (plugin.capabilities) {
        for (const capability of plugin.capabilities) {
          this.features.set(capability, {
            pluginId: plugin.id,
            capability,
            type: 'plugin_capability'
          });
        }
      }

      if (plugin.intents) {
        for (const intent of plugin.intents) {
          this.features.set(intent.id, {
            pluginId: plugin.id,
            intentId: intent.id,
            intent,
            type: 'plugin_intent'
          });
        }
      }

      this.logger.info(`Registered ${plugin.capabilities?.length || 0} capabilities and ${plugin.intents?.length || 0} intents for plugin ${plugin.id}`);
      
    } catch (error) {
      this.logger.error('Failed to register plugin features:', error);
      throw error;
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    try {
      this.logger.info('Unregistering plugin features:', { pluginId });
      
      // Remove plugin features
      for (const [featureId, feature] of this.features) {
        if (feature.pluginId === pluginId) {
          this.features.delete(featureId);
        }
      }

      this.logger.info(`Unregistered features for plugin ${pluginId}`);
      
    } catch (error) {
      this.logger.error('Failed to unregister plugin features:', error);
      throw error;
    }
  }

  async getFeatureCount(): Promise<number> {
    return this.features.size;
  }

  async getFeatures(): Promise<any[]> {
    return Array.from(this.features.values());
  }

  async getFeature(featureId: string): Promise<any> {
    return this.features.get(featureId);
  }

  async searchFeatures(query: string): Promise<any[]> {
    try {
      this.logger.debug('Searching features:', { query });
      
      const results = [];
      for (const [featureId, feature] of this.features) {
        if (featureId.toLowerCase().includes(query.toLowerCase()) ||
            feature.capability?.toLowerCase().includes(query.toLowerCase()) ||
            feature.intent?.name?.toLowerCase().includes(query.toLowerCase())) {
          results.push(feature);
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to search features:', error);
      throw error;
    }
  }
}