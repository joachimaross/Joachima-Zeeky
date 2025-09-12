/**
 * AI Optimizer - Advanced AI performance optimization and caching
 * Handles model optimization, response caching, and intelligent routing
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { Config } from '../utils/Config';
import { Intent, Response, AIService } from '../types/ZeekyTypes';

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'local';
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  costPerToken: number;
  latency: number;
  accuracy: number;
  capabilities: string[];
  isEnabled: boolean;
}

export interface CacheEntry {
  key: string;
  response: Response;
  timestamp: Date;
  ttl: number;
  hitCount: number;
  lastAccessed: Date;
  metadata: {
    intent: Intent;
    model: string;
    provider: string;
    processingTime: number;
    confidence: number;
  };
}

export interface OptimizationMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  averageCost: number;
  errorRate: number;
  modelUsage: Map<string, number>;
  providerUsage: Map<string, number>;
  topIntents: Array<{ intent: string; count: number }>;
  performanceScore: number;
}

export interface RoutingStrategy {
  name: string;
  description: string;
  criteria: {
    maxLatency?: number;
    maxCost?: number;
    minAccuracy?: number;
    requiredCapabilities?: string[];
    preferredProviders?: string[];
  };
  weights: {
    latency: number;
    cost: number;
    accuracy: number;
    availability: number;
  };
}

export class AIOptimizer extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private models: Map<string, ModelConfig> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private metrics: OptimizationMetrics;
  private routingStrategies: Map<string, RoutingStrategy> = new Map();
  private isInitialized = false;

  constructor(logger: Logger, config: Config) {
    super();
    this.logger = logger;
    this.config = config;
    this.metrics = this.initializeMetrics();
    this.setupDefaultModels();
    this.setupDefaultRoutingStrategies();
  }

  /**
   * Initialize the AI optimizer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.info('Initializing AI Optimizer...');
    
    try {
      // Load model configurations
      await this.loadModelConfigurations();
      
      // Initialize cache cleanup
      this.setupCacheCleanup();
      
      // Load routing strategies
      await this.loadRoutingStrategies();
      
      this.isInitialized = true;
      this.logger.info('AI Optimizer initialized successfully');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize AI Optimizer:', error);
      throw error;
    }
  }

  /**
   * Optimize AI request processing
   */
  async optimizeRequest(intent: Intent, context: any): Promise<Response> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(intent, context);
      const cachedResponse = this.getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        this.updateCacheMetrics(cacheKey, true);
        this.logger.debug(`Cache hit for intent: ${intent.action}`);
        return cachedResponse;
      }

      // Select optimal model and provider
      const selectedModel = await this.selectOptimalModel(intent, context);
      
      // Process request with selected model
      const response = await this.processWithModel(intent, context, selectedModel);
      
      // Cache the response
      this.cacheResponse(cacheKey, response, intent, selectedModel, Date.now() - startTime);
      
      // Update metrics
      this.updateMetrics(intent, selectedModel, Date.now() - startTime, true);
      
      this.logger.debug(`Request processed with ${selectedModel.provider}/${selectedModel.model}`);
      return response;
      
    } catch (error) {
      this.updateMetrics(intent, null, Date.now() - startTime, false);
      this.logger.error('AI optimization failed:', error);
      throw error;
    }
  }

  /**
   * Select optimal model for the request
   */
  private async selectOptimalModel(intent: Intent, context: any): Promise<ModelConfig> {
    const availableModels = Array.from(this.models.values())
      .filter(model => model.isEnabled);

    if (availableModels.length === 0) {
      throw new Error('No AI models available');
    }

    // Get routing strategy
    const strategy = this.getRoutingStrategy(intent, context);
    
    // Score models based on strategy
    const scoredModels = availableModels.map(model => ({
      model,
      score: this.calculateModelScore(model, intent, strategy)
    }));

    // Sort by score (highest first)
    scoredModels.sort((a, b) => b.score - a.score);
    
    const selectedModel = scoredModels[0].model;
    this.logger.debug(`Selected model: ${selectedModel.name} (score: ${scoredModels[0].score})`);
    
    return selectedModel;
  }

  /**
   * Calculate model score based on routing strategy
   */
  private calculateModelScore(model: ModelConfig, intent: Intent, strategy: RoutingStrategy): number {
    let score = 0;
    const weights = strategy.weights;
    const criteria = strategy.criteria;

    // Check if model meets basic criteria
    if (criteria.maxLatency && model.latency > criteria.maxLatency) return 0;
    if (criteria.maxCost && model.costPerToken > criteria.maxCost) return 0;
    if (criteria.minAccuracy && model.accuracy < criteria.minAccuracy) return 0;
    
    if (criteria.requiredCapabilities) {
      const hasAllCapabilities = criteria.requiredCapabilities.every(cap => 
        model.capabilities.includes(cap)
      );
      if (!hasAllCapabilities) return 0;
    }

    // Calculate weighted score
    score += (1 / model.latency) * weights.latency * 1000; // Lower latency = higher score
    score += (1 / model.costPerToken) * weights.cost * 1000; // Lower cost = higher score
    score += model.accuracy * weights.accuracy * 100; // Higher accuracy = higher score
    score += this.getModelAvailability(model) * weights.availability * 100; // Higher availability = higher score

    // Provider preference bonus
    if (criteria.preferredProviders?.includes(model.provider)) {
      score += 50;
    }

    return score;
  }

  /**
   * Get routing strategy for intent
   */
  private getRoutingStrategy(intent: Intent, context: any): RoutingStrategy {
    // Determine strategy based on intent type and context
    const intentType = this.categorizeIntent(intent);
    
    switch (intentType) {
      case 'critical':
        return this.routingStrategies.get('high_accuracy') || this.getDefaultStrategy();
      case 'cost_sensitive':
        return this.routingStrategies.get('cost_optimized') || this.getDefaultStrategy();
      case 'real_time':
        return this.routingStrategies.get('low_latency') || this.getDefaultStrategy();
      default:
        return this.getDefaultStrategy();
    }
  }

  /**
   * Categorize intent for routing
   */
  private categorizeIntent(intent: Intent): string {
    const criticalIntents = ['emergency', 'security', 'medical', 'financial'];
    const costSensitiveIntents = ['bulk_processing', 'batch_analysis', 'data_export'];
    const realTimeIntents = ['voice_interaction', 'live_chat', 'real_time_analysis'];

    if (criticalIntents.some(critical => intent.action.includes(critical))) {
      return 'critical';
    }
    
    if (costSensitiveIntents.some(cost => intent.action.includes(cost))) {
      return 'cost_sensitive';
    }
    
    if (realTimeIntents.some(real => intent.action.includes(real))) {
      return 'real_time';
    }
    
    return 'standard';
  }

  /**
   * Process request with specific model
   */
  private async processWithModel(intent: Intent, context: any, model: ModelConfig): Promise<Response> {
    // This would integrate with actual AI service providers
    // For now, return a mock response
    return {
      success: true,
      data: {
        intent: intent.action,
        model: model.name,
        provider: model.provider,
        response: `Mock response from ${model.name} for ${intent.action}`,
        confidence: model.accuracy,
        processingTime: model.latency
      },
      message: `Processed with ${model.name}`
    };
  }

  /**
   * Generate cache key for request
   */
  private generateCacheKey(intent: Intent, context: any): string {
    const intentKey = `${intent.action}:${JSON.stringify(intent.entities || [])}`;
    const contextKey = JSON.stringify(context || {});
    return Buffer.from(intentKey + contextKey).toString('base64');
  }

  /**
   * Get cached response
   */
  private getCachedResponse(key: string): Response | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if cache entry is expired
    const now = new Date();
    const expiresAt = new Date(entry.timestamp.getTime() + entry.ttl);
    
    if (now > expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access metrics
    entry.hitCount++;
    entry.lastAccessed = now;
    
    return entry.response;
  }

  /**
   * Cache response
   */
  private cacheResponse(
    key: string, 
    response: Response, 
    intent: Intent, 
    model: ModelConfig, 
    processingTime: number
  ): void {
    const ttl = this.calculateTTL(intent, model);
    
    const entry: CacheEntry = {
      key,
      response,
      timestamp: new Date(),
      ttl,
      hitCount: 0,
      lastAccessed: new Date(),
      metadata: {
        intent,
        model: model.name,
        provider: model.provider,
        processingTime,
        confidence: model.accuracy
      }
    };
    
    this.cache.set(key, entry);
    
    // Limit cache size
    if (this.cache.size > this.config.get('ai.cache.maxSize', 1000)) {
      this.evictLeastUsed();
    }
  }

  /**
   * Calculate TTL for cache entry
   */
  private calculateTTL(intent: Intent, model: ModelConfig): number {
    const baseTTL = this.config.get('ai.cache.baseTTL', 300000); // 5 minutes
    const intentMultiplier = this.getIntentTTLMultiplier(intent);
    const modelMultiplier = this.getModelTTLMultiplier(model);
    
    return baseTTL * intentMultiplier * modelMultiplier;
  }

  /**
   * Get TTL multiplier for intent type
   */
  private getIntentTTLMultiplier(intent: Intent): number {
    const staticIntents = ['get_weather', 'get_time', 'get_date'];
    const dynamicIntents = ['send_message', 'create_task', 'update_data'];
    
    if (staticIntents.some(static => intent.action.includes(static))) {
      return 10; // Cache for 50 minutes
    }
    
    if (dynamicIntents.some(dynamic => intent.action.includes(dynamic))) {
      return 0.1; // Cache for 30 seconds
    }
    
    return 1; // Default TTL
  }

  /**
   * Get TTL multiplier for model
   */
  private getModelTTLMultiplier(model: ModelConfig): number {
    // More expensive models get longer cache times
    if (model.costPerToken > 0.01) return 2;
    if (model.costPerToken > 0.005) return 1.5;
    return 1;
  }

  /**
   * Evict least used cache entries
   */
  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime());
    
    // Remove 10% of least used entries
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Update cache metrics
   */
  private updateCacheMetrics(key: string, isHit: boolean): void {
    if (isHit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }

  /**
   * Update optimization metrics
   */
  private updateMetrics(intent: Intent, model: ModelConfig | null, processingTime: number, success: boolean): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + processingTime) / 2;
      
      if (model) {
        this.metrics.averageCost = 
          (this.metrics.averageCost + model.costPerToken) / 2;
        
        // Update model usage
        const currentUsage = this.metrics.modelUsage.get(model.name) || 0;
        this.metrics.modelUsage.set(model.name, currentUsage + 1);
        
        // Update provider usage
        const currentProviderUsage = this.metrics.providerUsage.get(model.provider) || 0;
        this.metrics.providerUsage.set(model.provider, currentProviderUsage + 1);
      }
    } else {
      this.metrics.errorRate = 
        (this.metrics.errorRate * (this.metrics.totalRequests - 1) + 1) / this.metrics.totalRequests;
    }
    
    // Update top intents
    const existingIntent = this.metrics.topIntents.find(item => item.intent === intent.action);
    if (existingIntent) {
      existingIntent.count++;
    } else {
      this.metrics.topIntents.push({ intent: intent.action, count: 1 });
    }
    
    this.metrics.topIntents.sort((a, b) => b.count - a.count);
    this.metrics.topIntents = this.metrics.topIntents.slice(0, 10); // Keep top 10
    
    // Calculate performance score
    this.metrics.performanceScore = this.calculatePerformanceScore();
  }

  /**
   * Calculate overall performance score
   */
  private calculatePerformanceScore(): number {
    const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses);
    const responseTimeScore = Math.max(0, 1 - (this.metrics.averageResponseTime / 5000)); // 5s max
    const errorRateScore = 1 - this.metrics.errorRate;
    const costScore = Math.max(0, 1 - (this.metrics.averageCost / 0.01)); // $0.01 max per token
    
    return (cacheHitRate * 0.3 + responseTimeScore * 0.3 + errorRateScore * 0.2 + costScore * 0.2) * 100;
  }

  /**
   * Get model availability score
   */
  private getModelAvailability(model: ModelConfig): number {
    // Mock implementation - in real system, this would check actual availability
    return 0.95; // 95% availability
  }

  /**
   * Setup default models
   */
  private setupDefaultModels(): void {
    const defaultModels: ModelConfig[] = [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        model: 'gpt-4',
        maxTokens: 8192,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        costPerToken: 0.03,
        latency: 2000,
        accuracy: 0.95,
        capabilities: ['text_generation', 'reasoning', 'analysis'],
        isEnabled: true
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        maxTokens: 4096,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        costPerToken: 0.002,
        latency: 1000,
        accuracy: 0.90,
        capabilities: ['text_generation', 'conversation'],
        isEnabled: true
      },
      {
        id: 'claude-3',
        name: 'Claude 3',
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4096,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        costPerToken: 0.015,
        latency: 1500,
        accuracy: 0.92,
        capabilities: ['text_generation', 'analysis', 'reasoning'],
        isEnabled: true
      }
    ];

    defaultModels.forEach(model => {
      this.models.set(model.id, model);
    });
  }

  /**
   * Setup default routing strategies
   */
  private setupDefaultRoutingStrategies(): void {
    const strategies: RoutingStrategy[] = [
      {
        name: 'high_accuracy',
        description: 'Prioritize accuracy over speed and cost',
        criteria: {
          minAccuracy: 0.9,
          maxLatency: 5000
        },
        weights: {
          latency: 0.2,
          cost: 0.1,
          accuracy: 0.6,
          availability: 0.1
        }
      },
      {
        name: 'low_latency',
        description: 'Prioritize speed for real-time interactions',
        criteria: {
          maxLatency: 1000,
          minAccuracy: 0.8
        },
        weights: {
          latency: 0.6,
          cost: 0.2,
          accuracy: 0.1,
          availability: 0.1
        }
      },
      {
        name: 'cost_optimized',
        description: 'Minimize cost for bulk operations',
        criteria: {
          maxCost: 0.005,
          minAccuracy: 0.85
        },
        weights: {
          latency: 0.1,
          cost: 0.6,
          accuracy: 0.2,
          availability: 0.1
        }
      }
    ];

    strategies.forEach(strategy => {
      this.routingStrategies.set(strategy.name, strategy);
    });
  }

  /**
   * Get default routing strategy
   */
  private getDefaultStrategy(): RoutingStrategy {
    return this.routingStrategies.get('high_accuracy') || {
      name: 'default',
      description: 'Default balanced strategy',
      criteria: {},
      weights: {
        latency: 0.3,
        cost: 0.3,
        accuracy: 0.3,
        availability: 0.1
      }
    };
  }

  /**
   * Initialize metrics
   */
  private initializeMetrics(): OptimizationMetrics {
    return {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      averageCost: 0,
      errorRate: 0,
      modelUsage: new Map(),
      providerUsage: new Map(),
      topIntents: [],
      performanceScore: 0
    };
  }

  /**
   * Setup cache cleanup
   */
  private setupCacheCleanup(): void {
    // Clean up expired cache entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 5 * 60 * 1000);
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = new Date();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache) {
      const expiresAt = new Date(entry.timestamp.getTime() + entry.ttl);
      if (now > expiresAt) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      this.logger.debug(`Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  /**
   * Load model configurations
   */
  private async loadModelConfigurations(): Promise<void> {
    // Load from config or database (placeholder)
    this.logger.debug('Loading model configurations');
  }

  /**
   * Load routing strategies
   */
  private async loadRoutingStrategies(): Promise<void> {
    // Load from config or database (placeholder)
    this.logger.debug('Loading routing strategies');
  }

  /**
   * Get optimization metrics
   */
  getMetrics(): OptimizationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number; entries: CacheEntry[] } {
    const hitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0;
    return {
      size: this.cache.size,
      hitRate,
      entries: Array.from(this.cache.values())
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.info('AI optimization cache cleared');
  }

  /**
   * Add or update model configuration
   */
  addModel(model: ModelConfig): void {
    this.models.set(model.id, model);
    this.logger.info(`Added model: ${model.name}`);
  }

  /**
   * Remove model
   */
  removeModel(modelId: string): void {
    this.models.delete(modelId);
    this.logger.info(`Removed model: ${modelId}`);
  }

  /**
   * Shutdown optimizer
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down AI Optimizer...');
    this.cache.clear();
    this.isInitialized = false;
    this.logger.info('AI Optimizer shutdown complete');
  }
}