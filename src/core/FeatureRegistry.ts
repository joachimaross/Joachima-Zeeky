/**
 * Feature Registry for Zeeky system
 */

import { EventEmitter } from 'events';
import { Logger } from '@/utils/Logger';

export class FeatureRegistry extends EventEmitter {
  private logger: Logger;
  private features: Map<string, any> = new Map();
  private plugins: Map<string, any> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.logger = new Logger('FeatureRegistry');
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing feature registry...');
    this.isInitialized = true;
  }

  async registerPlugin(plugin: any): Promise<void> {
    this.logger.info('Registering plugin:', plugin.id);
    this.plugins.set(plugin.id, plugin);
    
    // Register plugin features
    if (plugin.intents && Array.isArray(plugin.intents)) {
      for (const intent of plugin.intents) {
        this.features.set(intent.id, {
          ...intent,
          pluginId: plugin.id,
          registeredAt: new Date()
        });
      }
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    this.logger.info('Unregistering plugin:', pluginId);
    this.plugins.delete(pluginId);
    
    // Remove plugin features
    for (const [featureId, feature] of this.features) {
      if (feature.pluginId === pluginId) {
        this.features.delete(featureId);
      }
    }
  }

  async getFeatureCount(): Promise<number> {
    return this.features.size;
  }

  async getFeatures(): Promise<any[]> {
    return Array.from(this.features.values());
  }

  async getPlugins(): Promise<any[]> {
    return Array.from(this.plugins.values());
  }
}