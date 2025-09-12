/**
 * Plugin Registry - Dynamic Plugin Loading and Management System
 * Handles plugin discovery, registration, lifecycle, and execution
 */

import { EventEmitter } from 'events';
import { ZeekyPlugin, PluginContext, PluginStatus, PluginMetrics, PluginDependency } from '../types/ZeekyTypes';
import { Logger } from '../utils/Logger';
import { Config } from '../utils/Config';
import * as fs from 'fs';
import * as path from 'path';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  priority: number;
  dependencies: PluginDependency[];
  capabilities: string[];
  permissions: any[];
  entryPoint: string;
  configSchema?: any;
}

export interface PluginInstance {
  plugin: ZeekyPlugin;
  manifest: PluginManifest;
  status: PluginStatus;
  metrics: PluginMetrics;
  context: PluginContext;
  lastUsed: Date;
  loadTime: number;
}

export class PluginRegistry extends EventEmitter {
  private plugins: Map<string, PluginInstance> = new Map();
  private pluginDirectories: string[] = [];
  private logger: Logger;
  private config: Config;
  private isInitialized = false;

  constructor(logger: Logger, config: Config) {
    super();
    this.logger = logger;
    this.config = config;
    this.pluginDirectories = [
      path.join(process.cwd(), 'src/plugins'),
      path.join(process.cwd(), 'plugins'),
      path.join(process.cwd(), 'node_modules/@zeeky/plugins')
    ];
  }

  /**
   * Initialize the plugin registry
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.info('Initializing Plugin Registry...');
    
    try {
      // Discover and load all plugins
      await this.discoverPlugins();
      await this.loadAllPlugins();
      
      this.isInitialized = true;
      this.logger.info(`Plugin Registry initialized with ${this.plugins.size} plugins`);
      this.emit('initialized', { pluginCount: this.plugins.size });
    } catch (error) {
      this.logger.error('Failed to initialize Plugin Registry:', error);
      throw error;
    }
  }

  /**
   * Discover plugins in configured directories
   */
  private async discoverPlugins(): Promise<PluginManifest[]> {
    const manifests: PluginManifest[] = [];

    for (const dir of this.pluginDirectories) {
      if (fs.existsSync(dir)) {
        const pluginDirs = fs.readdirSync(dir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const pluginDir of pluginDirs) {
          const manifestPath = path.join(dir, pluginDir, 'manifest.json');
          if (fs.existsSync(manifestPath)) {
            try {
              const manifestData = fs.readFileSync(manifestPath, 'utf8');
              const manifest: PluginManifest = JSON.parse(manifestData);
              manifests.push(manifest);
              this.logger.debug(`Discovered plugin: ${manifest.name} v${manifest.version}`);
            } catch (error) {
              this.logger.warn(`Failed to parse manifest for ${pluginDir}:`, error);
            }
          }
        }
      }
    }

    return manifests;
  }

  /**
   * Load a single plugin
   */
  private async loadPlugin(manifest: PluginManifest): Promise<PluginInstance> {
    const startTime = Date.now();
    
    try {
      // Find the plugin file
      const pluginPath = this.findPluginFile(manifest);
      if (!pluginPath) {
        throw new Error(`Plugin file not found for ${manifest.id}`);
      }

      // Dynamically import the plugin
      const pluginModule = await import(pluginPath);
      const PluginClass = pluginModule.default || pluginModule[manifest.id];
      
      if (!PluginClass) {
        throw new Error(`Plugin class not found in ${pluginPath}`);
      }

      // Create plugin instance
      const plugin = new PluginClass();
      
      // Create plugin context
      const context: PluginContext = {
        pluginId: manifest.id,
        version: manifest.version,
        config: this.config.get(`plugins.${manifest.id}`, {}),
        logger: this.logger.child({ plugin: manifest.id }),
        permissions: manifest.permissions,
        capabilities: manifest.capabilities
      };

      // Initialize plugin
      await plugin.initialize(context);

      const loadTime = Date.now() - startTime;
      
      const instance: PluginInstance = {
        plugin,
        manifest,
        status: {
          loaded: true,
          initialized: true,
          active: true,
          lastError: null,
          loadTime,
          uptime: 0
        },
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0,
          lastUsed: new Date(),
          memoryUsage: 0,
          cpuUsage: 0
        },
        context,
        lastUsed: new Date(),
        loadTime
      };

      this.logger.info(`Loaded plugin: ${manifest.name} v${manifest.version} (${loadTime}ms)`);
      this.emit('pluginLoaded', { manifest, loadTime });
      
      return instance;
    } catch (error) {
      this.logger.error(`Failed to load plugin ${manifest.id}:`, error);
      throw error;
    }
  }

  /**
   * Find the actual plugin file
   */
  private findPluginFile(manifest: PluginManifest): string | null {
    for (const dir of this.pluginDirectories) {
      const possiblePaths = [
        path.join(dir, manifest.id, manifest.entryPoint),
        path.join(dir, manifest.id, 'index.js'),
        path.join(dir, manifest.id, 'index.ts'),
        path.join(dir, manifest.id, `${manifest.id}.js`),
        path.join(dir, manifest.id, `${manifest.id}.ts`)
      ];

      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          return possiblePath;
        }
      }
    }
    return null;
  }

  /**
   * Load all discovered plugins
   */
  private async loadAllPlugins(): Promise<void> {
    const manifests = await this.discoverPlugins();
    
    // Sort by priority (higher priority first)
    manifests.sort((a, b) => b.priority - a.priority);

    // Load plugins in parallel (with dependency resolution)
    const loadPromises = manifests.map(async (manifest) => {
      try {
        const instance = await this.loadPlugin(manifest);
        this.plugins.set(manifest.id, instance);
      } catch (error) {
        this.logger.error(`Failed to load plugin ${manifest.id}:`, error);
        // Continue loading other plugins
      }
    });

    await Promise.allSettled(loadPromises);
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): PluginInstance | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins by category
   */
  getPluginsByCategory(category: string): PluginInstance[] {
    return this.getAllPlugins().filter(instance => 
      instance.manifest.category === category
    );
  }

  /**
   * Execute plugin intent
   */
  async executeIntent(pluginId: string, intent: any, context: any): Promise<any> {
    const instance = this.plugins.get(pluginId);
    if (!instance) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (!instance.status.active) {
      throw new Error(`Plugin ${pluginId} is not active`);
    }

    const startTime = Date.now();
    
    try {
      const result = await instance.plugin.handleIntent(intent, context);
      
      // Update metrics
      const responseTime = Date.now() - startTime;
      instance.metrics.totalRequests++;
      instance.metrics.successfulRequests++;
      instance.metrics.averageResponseTime = 
        (instance.metrics.averageResponseTime + responseTime) / 2;
      instance.metrics.lastUsed = new Date();
      instance.lastUsed = new Date();

      this.emit('intentExecuted', { pluginId, intent, responseTime, success: true });
      
      return result;
    } catch (error) {
      // Update metrics
      instance.metrics.totalRequests++;
      instance.metrics.failedRequests++;
      instance.metrics.lastUsed = new Date();
      instance.status.lastError = error instanceof Error ? error.message : String(error);

      this.emit('intentExecuted', { pluginId, intent, error, success: false });
      throw error;
    }
  }

  /**
   * Reload a plugin
   */
  async reloadPlugin(pluginId: string): Promise<void> {
    const instance = this.plugins.get(pluginId);
    if (!instance) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    this.logger.info(`Reloading plugin: ${pluginId}`);
    
    try {
      // Stop the plugin
      await instance.plugin.stop();
      
      // Reload the plugin
      const newInstance = await this.loadPlugin(instance.manifest);
      this.plugins.set(pluginId, newInstance);
      
      this.emit('pluginReloaded', { pluginId });
      this.logger.info(`Plugin ${pluginId} reloaded successfully`);
    } catch (error) {
      this.logger.error(`Failed to reload plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get plugin metrics
   */
  getMetrics(): Map<string, PluginMetrics> {
    const metrics = new Map<string, PluginMetrics>();
    for (const [id, instance] of this.plugins) {
      metrics.set(id, instance.metrics);
    }
    return metrics;
  }

  /**
   * Shutdown all plugins
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Plugin Registry...');
    
    const shutdownPromises = Array.from(this.plugins.values()).map(async (instance) => {
      try {
        await instance.plugin.stop();
        this.logger.debug(`Plugin ${instance.manifest.id} stopped`);
      } catch (error) {
        this.logger.error(`Error stopping plugin ${instance.manifest.id}:`, error);
      }
    });

    await Promise.allSettled(shutdownPromises);
    this.plugins.clear();
    this.isInitialized = false;
    
    this.logger.info('Plugin Registry shutdown complete');
  }
}