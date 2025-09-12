/**
 * Feature Registry - Central registry for managing 10,000+ features
 * Handles feature discovery, registration, lifecycle, and orchestration
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { Config } from '../utils/Config';
import { ZeekyPlugin, PluginContext, Intent, Response } from '../types/ZeekyTypes';
import { GeneratedFeature, FeatureCategory } from './FeatureGenerator';

export interface FeatureIndex {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  status: 'active' | 'inactive' | 'deprecated' | 'experimental';
  version: string;
  lastUpdated: Date;
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastUsed: Date;
  };
  dependencies: string[];
  dependents: string[];
  tags: string[];
  searchKeywords: string[];
}

export interface FeatureSearchResult {
  feature: FeatureIndex;
  score: number;
  matchedFields: string[];
}

export interface FeatureUsage {
  featureId: string;
  userId: string;
  timestamp: Date;
  intent: string;
  responseTime: number;
  success: boolean;
  context: any;
}

export interface FeatureAnalytics {
  totalFeatures: number;
  activeFeatures: number;
  categoryBreakdown: Record<string, number>;
  topUsedFeatures: Array<{ featureId: string; usage: number }>;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  mostCommonIntents: Array<{ intent: string; count: number }>;
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    averageFeaturesPerUser: number;
  };
}

export class FeatureRegistry extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private features: Map<string, GeneratedFeature> = new Map();
  private featureIndex: Map<string, FeatureIndex> = new Map();
  private featureUsage: FeatureUsage[] = [];
  private searchIndex: Map<string, Set<string>> = new Map();
  private isInitialized = false;

  constructor(logger: Logger, config: Config) {
    super();
    this.logger = logger;
    this.config = config;
  }

  /**
   * Initialize the feature registry
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.info('Initializing Feature Registry...');
    
    try {
      // Load existing features
      await this.loadFeatures();
      
      // Build search index
      this.buildSearchIndex();
      
      // Start usage tracking
      this.startUsageTracking();
      
      this.isInitialized = true;
      this.logger.info(`Feature Registry initialized with ${this.features.size} features`);
      this.emit('initialized', { featureCount: this.features.size });
    } catch (error) {
      this.logger.error('Failed to initialize Feature Registry:', error);
      throw error;
    }
  }

  /**
   * Register a feature
   */
  async registerFeature(feature: GeneratedFeature): Promise<void> {
    this.features.set(feature.id, feature);
    
    // Create feature index
    const index: FeatureIndex = {
      id: feature.id,
      name: feature.name,
      category: feature.category,
      subcategory: feature.subcategory,
      status: 'active',
      version: '1.0.0',
      lastUpdated: new Date(),
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        lastUsed: new Date()
      },
      dependencies: feature.plugin.getMetadata().dependencies || [],
      dependents: [],
      tags: this.generateTags(feature),
      searchKeywords: this.generateSearchKeywords(feature)
    };
    
    this.featureIndex.set(feature.id, index);
    
    // Update search index
    this.updateSearchIndex(feature.id, index);
    
    this.logger.info(`Registered feature: ${feature.name} (${feature.id})`);
    this.emit('featureRegistered', feature);
  }

  /**
   * Unregister a feature
   */
  async unregisterFeature(featureId: string): Promise<void> {
    const feature = this.features.get(featureId);
    if (!feature) return;
    
    this.features.delete(featureId);
    this.featureIndex.delete(featureId);
    
    // Remove from search index
    this.removeFromSearchIndex(featureId);
    
    this.logger.info(`Unregistered feature: ${feature.name} (${featureId})`);
    this.emit('featureUnregistered', feature);
  }

  /**
   * Get feature by ID
   */
  getFeature(featureId: string): GeneratedFeature | undefined {
    return this.features.get(featureId);
  }

  /**
   * Get feature index
   */
  getFeatureIndex(featureId: string): FeatureIndex | undefined {
    return this.featureIndex.get(featureId);
  }

  /**
   * Get all features
   */
  getAllFeatures(): GeneratedFeature[] {
    return Array.from(this.features.values());
  }

  /**
   * Get features by category
   */
  getFeaturesByCategory(category: string): GeneratedFeature[] {
    return Array.from(this.features.values()).filter(f => f.category === category);
  }

  /**
   * Get features by subcategory
   */
  getFeaturesBySubcategory(category: string, subcategory: string): GeneratedFeature[] {
    return Array.from(this.features.values()).filter(f => 
      f.category === category && f.subcategory === subcategory
    );
  }

  /**
   * Search features
   */
  searchFeatures(query: string, options?: {
    category?: string;
    subcategory?: string;
    status?: FeatureIndex['status'];
    limit?: number;
    minScore?: number;
  }): FeatureSearchResult[] {
    const searchTerms = query.toLowerCase().split(/\s+/);
    const results: FeatureSearchResult[] = [];
    
    for (const [featureId, index] of this.featureIndex) {
      // Apply filters
      if (options?.category && index.category !== options.category) continue;
      if (options?.subcategory && index.subcategory !== options.subcategory) continue;
      if (options?.status && index.status !== options.status) continue;
      
      let score = 0;
      const matchedFields: string[] = [];
      
      // Score based on search terms
      for (const term of searchTerms) {
        // Name match (highest weight)
        if (index.name.toLowerCase().includes(term)) {
          score += 10;
          matchedFields.push('name');
        }
        
        // Description match
        const feature = this.features.get(featureId);
        if (feature?.description.toLowerCase().includes(term)) {
          score += 5;
          matchedFields.push('description');
        }
        
        // Tag match
        if (index.tags.some(tag => tag.toLowerCase().includes(term))) {
          score += 3;
          matchedFields.push('tags');
        }
        
        // Keyword match
        if (index.searchKeywords.some(keyword => keyword.toLowerCase().includes(term))) {
          score += 2;
          matchedFields.push('keywords');
        }
        
        // Category/subcategory match
        if (index.category.toLowerCase().includes(term)) {
          score += 1;
          matchedFields.push('category');
        }
        
        if (index.subcategory.toLowerCase().includes(term)) {
          score += 1;
          matchedFields.push('subcategory');
        }
      }
      
      // Boost score for active features
      if (index.status === 'active') {
        score += 1;
      }
      
      // Boost score for frequently used features
      score += Math.min(index.usage.totalRequests / 100, 5);
      
      if (score > 0 && (!options?.minScore || score >= options.minScore)) {
        results.push({
          feature: index,
          score,
          matchedFields: [...new Set(matchedFields)]
        });
      }
    }
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    // Apply limit
    if (options?.limit) {
      return results.slice(0, options.limit);
    }
    
    return results;
  }

  /**
   * Execute feature intent
   */
  async executeFeatureIntent(
    featureId: string, 
    intent: Intent, 
    context: any,
    userId?: string
  ): Promise<Response> {
    const feature = this.features.get(featureId);
    if (!feature) {
      throw new Error(`Feature not found: ${featureId}`);
    }
    
    const startTime = Date.now();
    
    try {
      const response = await feature.plugin.handleIntent(intent, context);
      
      // Record usage
      this.recordUsage({
        featureId,
        userId: userId || 'anonymous',
        timestamp: new Date(),
        intent: intent.action,
        responseTime: Date.now() - startTime,
        success: response.success,
        context
      });
      
      // Update feature index
      this.updateFeatureUsage(featureId, Date.now() - startTime, response.success);
      
      this.emit('featureExecuted', { featureId, intent, response, userId });
      
      return response;
    } catch (error) {
      // Record failed usage
      this.recordUsage({
        featureId,
        userId: userId || 'anonymous',
        timestamp: new Date(),
        intent: intent.action,
        responseTime: Date.now() - startTime,
        success: false,
        context
      });
      
      // Update feature index
      this.updateFeatureUsage(featureId, Date.now() - startTime, false);
      
      this.logger.error(`Feature execution failed for ${featureId}:`, error);
      throw error;
    }
  }

  /**
   * Get feature analytics
   */
  getFeatureAnalytics(): FeatureAnalytics {
    const totalFeatures = this.features.size;
    const activeFeatures = Array.from(this.featureIndex.values())
      .filter(index => index.status === 'active').length;
    
    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    for (const index of this.featureIndex.values()) {
      categoryBreakdown[index.category] = (categoryBreakdown[index.category] || 0) + 1;
    }
    
    // Top used features
    const topUsedFeatures = Array.from(this.featureIndex.values())
      .sort((a, b) => b.usage.totalRequests - a.usage.totalRequests)
      .slice(0, 10)
      .map(index => ({
        featureId: index.id,
        usage: index.usage.totalRequests
      }));
    
    // Average response time
    const totalResponseTime = Array.from(this.featureIndex.values())
      .reduce((sum, index) => sum + index.usage.averageResponseTime, 0);
    const averageResponseTime = totalResponseTime / totalFeatures;
    
    // Success rate
    const totalRequests = Array.from(this.featureIndex.values())
      .reduce((sum, index) => sum + index.usage.totalRequests, 0);
    const successfulRequests = Array.from(this.featureIndex.values())
      .reduce((sum, index) => sum + index.usage.successfulRequests, 0);
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    const errorRate = 100 - successRate;
    
    // Most common intents
    const intentCounts: Record<string, number> = {};
    for (const usage of this.featureUsage) {
      intentCounts[usage.intent] = (intentCounts[usage.intent] || 0) + 1;
    }
    const mostCommonIntents = Object.entries(intentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([intent, count]) => ({ intent, count }));
    
    // User engagement
    const uniqueUsers = new Set(this.featureUsage.map(u => u.userId)).size;
    const activeUsers = new Set(
      this.featureUsage
        .filter(u => u.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000)
        .map(u => u.userId)
    ).size;
    const averageFeaturesPerUser = uniqueUsers > 0 ? totalRequests / uniqueUsers : 0;
    
    return {
      totalFeatures,
      activeFeatures,
      categoryBreakdown,
      topUsedFeatures,
      averageResponseTime,
      successRate,
      errorRate,
      mostCommonIntents,
      userEngagement: {
        totalUsers: uniqueUsers,
        activeUsers,
        averageFeaturesPerUser
      }
    };
  }

  /**
   * Get feature recommendations
   */
  getFeatureRecommendations(
    userId: string, 
    limit: number = 10
  ): FeatureSearchResult[] {
    // Get user's feature usage history
    const userUsage = this.featureUsage.filter(u => u.userId === userId);
    
    if (userUsage.length === 0) {
      // Return popular features for new users
      return this.searchFeatures('', { limit, status: 'active' });
    }
    
    // Find similar features based on usage patterns
    const userCategories = new Set(userUsage.map(u => {
      const index = this.featureIndex.get(u.featureId);
      return index?.category;
    }).filter(Boolean));
    
    const userSubcategories = new Set(userUsage.map(u => {
      const index = this.featureIndex.get(u.featureId);
      return index?.subcategory;
    }).filter(Boolean));
    
    // Search for features in similar categories
    const recommendations: FeatureSearchResult[] = [];
    
    for (const category of userCategories) {
      const categoryFeatures = this.searchFeatures('', { 
        category, 
        limit: Math.ceil(limit / userCategories.size),
        status: 'active'
      });
      recommendations.push(...categoryFeatures);
    }
    
    // Remove already used features
    const usedFeatureIds = new Set(userUsage.map(u => u.featureId));
    const filteredRecommendations = recommendations.filter(r => 
      !usedFeatureIds.has(r.feature.id)
    );
    
    return filteredRecommendations.slice(0, limit);
  }

  /**
   * Record feature usage
   */
  private recordUsage(usage: FeatureUsage): void {
    this.featureUsage.push(usage);
    
    // Keep only last 100,000 usage records
    if (this.featureUsage.length > 100000) {
      this.featureUsage = this.featureUsage.slice(-100000);
    }
  }

  /**
   * Update feature usage statistics
   */
  private updateFeatureUsage(featureId: string, responseTime: number, success: boolean): void {
    const index = this.featureIndex.get(featureId);
    if (!index) return;
    
    index.usage.totalRequests++;
    if (success) {
      index.usage.successfulRequests++;
    } else {
      index.usage.failedRequests++;
    }
    
    // Update average response time
    index.usage.averageResponseTime = 
      (index.usage.averageResponseTime + responseTime) / 2;
    
    index.usage.lastUsed = new Date();
    index.lastUpdated = new Date();
    
    this.featureIndex.set(featureId, index);
  }

  /**
   * Generate tags for feature
   */
  private generateTags(feature: GeneratedFeature): string[] {
    const tags: string[] = [];
    
    // Add category and subcategory as tags
    tags.push(feature.category);
    tags.push(feature.subcategory);
    
    // Add complexity as tag
    tags.push(feature.status);
    
    // Add capability tags
    const capabilities = feature.plugin.getCapabilities();
    tags.push(...capabilities);
    
    // Add intent tags
    const metadata = feature.plugin.getMetadata();
    if (metadata.capabilities) {
      tags.push(...metadata.capabilities);
    }
    
    return [...new Set(tags)];
  }

  /**
   * Generate search keywords
   */
  private generateSearchKeywords(feature: GeneratedFeature): string[] {
    const keywords: string[] = [];
    
    // Add name words
    keywords.push(...feature.name.toLowerCase().split(/\s+/));
    
    // Add description words
    keywords.push(...feature.description.toLowerCase().split(/\s+/));
    
    // Add capability keywords
    const capabilities = feature.plugin.getCapabilities();
    keywords.push(...capabilities.map(c => c.toLowerCase().replace(/_/g, ' ')));
    
    // Add common synonyms
    const synonyms: Record<string, string[]> = {
      'calendar': ['schedule', 'event', 'meeting', 'appointment'],
      'email': ['mail', 'message', 'correspondence'],
      'task': ['todo', 'job', 'work', 'assignment'],
      'note': ['memo', 'reminder', 'annotation'],
      'light': ['lamp', 'bulb', 'illumination'],
      'music': ['audio', 'song', 'track', 'playlist'],
      'weather': ['forecast', 'climate', 'temperature']
    };
    
    for (const [key, values] of Object.entries(synonyms)) {
      if (keywords.some(k => k.includes(key))) {
        keywords.push(...values);
      }
    }
    
    return [...new Set(keywords.filter(k => k.length > 2))];
  }

  /**
   * Build search index
   */
  private buildSearchIndex(): void {
    this.searchIndex.clear();
    
    for (const [featureId, index] of this.featureIndex) {
      this.updateSearchIndex(featureId, index);
    }
  }

  /**
   * Update search index for a feature
   */
  private updateSearchIndex(featureId: string, index: FeatureIndex): void {
    const allTerms = [
      index.name,
      index.category,
      index.subcategory,
      ...index.tags,
      ...index.searchKeywords
    ].map(term => term.toLowerCase());
    
    for (const term of allTerms) {
      const words = term.split(/\s+/);
      for (const word of words) {
        if (word.length > 2) {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set());
          }
          this.searchIndex.get(word)!.add(featureId);
        }
      }
    }
  }

  /**
   * Remove feature from search index
   */
  private removeFromSearchIndex(featureId: string): void {
    for (const [word, featureIds] of this.searchIndex) {
      featureIds.delete(featureId);
      if (featureIds.size === 0) {
        this.searchIndex.delete(word);
      }
    }
  }

  /**
   * Start usage tracking
   */
  private startUsageTracking(): void {
    // Clean up old usage data every hour
    setInterval(() => {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
      this.featureUsage = this.featureUsage.filter(u => u.timestamp >= cutoff);
    }, 60 * 60 * 1000);
  }

  /**
   * Load features from storage
   */
  private async loadFeatures(): Promise<void> {
    // In a real implementation, this would load from database
    this.logger.debug('Loading features from storage');
  }

  /**
   * Shutdown feature registry
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Feature Registry...');
    this.features.clear();
    this.featureIndex.clear();
    this.featureUsage = [];
    this.searchIndex.clear();
    this.isInitialized = false;
    this.logger.info('Feature Registry shutdown complete');
  }
}