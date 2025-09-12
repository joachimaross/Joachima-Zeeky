/**
 * Performance Optimizer - Advanced performance monitoring and optimization
 * Handles caching, load balancing, resource optimization, and scaling
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { Config } from '../utils/Config';

export interface PerformanceMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    load: number[];
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    free: number;
    usage: number;
  };
  disk: {
    used: number;
    total: number;
    free: number;
    usage: number;
    iops: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    latency: number;
  };
  application: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    activeConnections: number;
    queueLength: number;
  };
  cache: {
    hitRate: number;
    missRate: number;
    size: number;
    evictions: number;
  };
}

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  condition: OptimizationCondition;
  action: OptimizationAction;
  enabled: boolean;
  priority: number;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface OptimizationCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number; // seconds
  aggregation?: 'avg' | 'max' | 'min' | 'sum';
}

export interface OptimizationAction {
  type: 'scale_up' | 'scale_down' | 'cache_clear' | 'gc_force' | 'load_balance' | 'circuit_breaker' | 'rate_limit';
  parameters: Record<string, any>;
  cooldown: number; // seconds
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  targetMemory: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  scaleUpCooldown: number;
  scaleDownCooldown: number;
}

export interface CacheConfig {
  maxSize: number;
  ttl: number;
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  compression: boolean;
  persistence: boolean;
}

export interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'weighted_round_robin' | 'ip_hash' | 'least_response_time';
  healthCheckInterval: number;
  healthCheckTimeout: number;
  maxRetries: number;
  backoffMultiplier: number;
}

export class PerformanceOptimizer extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private metrics: PerformanceMetrics[] = [];
  private optimizationRules: Map<string, OptimizationRule> = new Map();
  private scalingConfig: ScalingConfig;
  private cacheConfig: CacheConfig;
  private loadBalancerConfig: LoadBalancerConfig;
  private isInitialized = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private optimizationInterval: NodeJS.Timeout | null = null;

  constructor(logger: Logger, config: Config) {
    super();
    this.logger = logger;
    this.config = config;
    this.scalingConfig = this.loadScalingConfig();
    this.cacheConfig = this.loadCacheConfig();
    this.loadBalancerConfig = this.loadLoadBalancerConfig();
  }

  /**
   * Initialize the performance optimizer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.info('Initializing Performance Optimizer...');
    
    try {
      // Load optimization rules
      await this.loadOptimizationRules();
      
      // Start monitoring
      this.startMonitoring();
      
      // Start optimization engine
      this.startOptimizationEngine();
      
      this.isInitialized = true;
      this.logger.info('Performance Optimizer initialized successfully');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Performance Optimizer:', error);
      throw error;
    }
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    const interval = this.config.get('performance.monitoringInterval', 5000); // 5 seconds
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        this.metrics.push(metrics);
        
        // Keep only last 1000 metrics
        if (this.metrics.length > 1000) {
          this.metrics = this.metrics.slice(-1000);
        }
        
        this.emit('metricsCollected', metrics);
      } catch (error) {
        this.logger.error('Failed to collect metrics:', error);
      }
    }, interval);
  }

  /**
   * Start optimization engine
   */
  private startOptimizationEngine(): void {
    const interval = this.config.get('performance.optimizationInterval', 30000); // 30 seconds
    
    this.optimizationInterval = setInterval(async () => {
      try {
        await this.runOptimizations();
      } catch (error) {
        this.logger.error('Failed to run optimizations:', error);
      }
    }, interval);
  }

  /**
   * Collect system metrics
   */
  private async collectMetrics(): Promise<PerformanceMetrics> {
    const timestamp = new Date();
    
    // Collect CPU metrics
    const cpuUsage = await this.getCPUUsage();
    const cpuLoad = await this.getCPULoad();
    const cpuCores = await this.getCPUCores();
    
    // Collect memory metrics
    const memoryUsage = process.memoryUsage();
    const totalMemory = await this.getTotalMemory();
    
    // Collect disk metrics
    const diskUsage = await this.getDiskUsage();
    
    // Collect network metrics
    const networkStats = await this.getNetworkStats();
    
    // Collect application metrics
    const appMetrics = await this.getApplicationMetrics();
    
    // Collect cache metrics
    const cacheMetrics = await this.getCacheMetrics();
    
    return {
      timestamp,
      cpu: {
        usage: cpuUsage,
        load: cpuLoad,
        cores: cpuCores
      },
      memory: {
        used: memoryUsage.heapUsed,
        total: totalMemory,
        free: totalMemory - memoryUsage.heapUsed,
        usage: (memoryUsage.heapUsed / totalMemory) * 100
      },
      disk: {
        used: diskUsage.used,
        total: diskUsage.total,
        free: diskUsage.free,
        usage: (diskUsage.used / diskUsage.total) * 100,
        iops: diskUsage.iops
      },
      network: {
        bytesIn: networkStats.bytesIn,
        bytesOut: networkStats.bytesOut,
        packetsIn: networkStats.packetsIn,
        packetsOut: networkStats.packetsOut,
        latency: networkStats.latency
      },
      application: {
        responseTime: appMetrics.responseTime,
        throughput: appMetrics.throughput,
        errorRate: appMetrics.errorRate,
        activeConnections: appMetrics.activeConnections,
        queueLength: appMetrics.queueLength
      },
      cache: {
        hitRate: cacheMetrics.hitRate,
        missRate: cacheMetrics.missRate,
        size: cacheMetrics.size,
        evictions: cacheMetrics.evictions
      }
    };
  }

  /**
   * Get CPU usage percentage
   */
  private async getCPUUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = Date.now();
      
      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const endTime = Date.now();
        
        const cpuTime = (endUsage.user + endUsage.system) / 1000; // Convert to milliseconds
        const totalTime = endTime - startTime;
        const cpuUsage = (cpuTime / totalTime) * 100;
        
        resolve(Math.min(cpuUsage, 100));
      }, 100);
    });
  }

  /**
   * Get CPU load average
   */
  private async getCPULoad(): Promise<number[]> {
    // Mock implementation - in real system, use os.loadavg()
    return [0.5, 0.6, 0.7];
  }

  /**
   * Get number of CPU cores
   */
  private async getCPUCores(): Promise<number> {
    return require('os').cpus().length;
  }

  /**
   * Get total system memory
   */
  private async getTotalMemory(): Promise<number> {
    return require('os').totalmem();
  }

  /**
   * Get disk usage
   */
  private async getDiskUsage(): Promise<{ used: number; total: number; free: number; iops: number }> {
    // Mock implementation - in real system, use disk usage APIs
    return {
      used: 500 * 1024 * 1024 * 1024, // 500GB
      total: 1000 * 1024 * 1024 * 1024, // 1TB
      free: 500 * 1024 * 1024 * 1024, // 500GB
      iops: 1000
    };
  }

  /**
   * Get network statistics
   */
  private async getNetworkStats(): Promise<{
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    latency: number;
  }> {
    // Mock implementation - in real system, use network monitoring APIs
    return {
      bytesIn: 1024 * 1024, // 1MB
      bytesOut: 512 * 1024, // 512KB
      packetsIn: 1000,
      packetsOut: 800,
      latency: 50 // 50ms
    };
  }

  /**
   * Get application metrics
   */
  private async getApplicationMetrics(): Promise<{
    responseTime: number;
    throughput: number;
    errorRate: number;
    activeConnections: number;
    queueLength: number;
  }> {
    // Mock implementation - in real system, collect from application
    return {
      responseTime: 150, // 150ms
      throughput: 1000, // requests per second
      errorRate: 0.01, // 1%
      activeConnections: 50,
      queueLength: 10
    };
  }

  /**
   * Get cache metrics
   */
  private async getCacheMetrics(): Promise<{
    hitRate: number;
    missRate: number;
    size: number;
    evictions: number;
  }> {
    // Mock implementation - in real system, collect from cache
    return {
      hitRate: 0.85, // 85%
      missRate: 0.15, // 15%
      size: 100 * 1024 * 1024, // 100MB
      evictions: 50
    };
  }

  /**
   * Run optimization rules
   */
  private async runOptimizations(): Promise<void> {
    const recentMetrics = this.getRecentMetrics(60); // Last 60 seconds
    
    for (const rule of this.optimizationRules.values()) {
      if (!rule.enabled) continue;
      
      try {
        const shouldTrigger = await this.evaluateRule(rule, recentMetrics);
        
        if (shouldTrigger) {
          await this.executeOptimization(rule);
          rule.lastTriggered = new Date();
          rule.triggerCount++;
          
          this.logger.info(`Optimization rule triggered: ${rule.name}`);
          this.emit('optimizationTriggered', rule);
        }
      } catch (error) {
        this.logger.error(`Failed to evaluate rule ${rule.name}:`, error);
      }
    }
  }

  /**
   * Evaluate optimization rule
   */
  private async evaluateRule(rule: OptimizationRule, metrics: PerformanceMetrics[]): Promise<boolean> {
    if (!metrics.length) return false;
    
    // Check cooldown
    if (rule.lastTriggered) {
      const cooldownMs = rule.action.cooldown * 1000;
      if (Date.now() - rule.lastTriggered.getTime() < cooldownMs) {
        return false;
      }
    }
    
    const condition = rule.condition;
    const values = this.extractMetricValues(metrics, condition.metric);
    
    if (!values.length) return false;
    
    // Apply aggregation
    let aggregatedValue: number;
    switch (condition.aggregation || 'avg') {
      case 'avg':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'sum':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      default:
        aggregatedValue = values[values.length - 1]; // Latest value
    }
    
    // Check condition
    switch (condition.operator) {
      case 'gt':
        return aggregatedValue > condition.threshold;
      case 'lt':
        return aggregatedValue < condition.threshold;
      case 'eq':
        return Math.abs(aggregatedValue - condition.threshold) < 0.001;
      case 'gte':
        return aggregatedValue >= condition.threshold;
      case 'lte':
        return aggregatedValue <= condition.threshold;
      default:
        return false;
    }
  }

  /**
   * Extract metric values from metrics array
   */
  private extractMetricValues(metrics: PerformanceMetrics[], metricPath: string): number[] {
    return metrics.map(metric => {
      const parts = metricPath.split('.');
      let value: any = metric;
      
      for (const part of parts) {
        value = value?.[part];
      }
      
      return typeof value === 'number' ? value : 0;
    });
  }

  /**
   * Execute optimization action
   */
  private async executeOptimization(rule: OptimizationRule): Promise<void> {
    const action = rule.action;
    
    switch (action.type) {
      case 'scale_up':
        await this.scaleUp(action.parameters);
        break;
      case 'scale_down':
        await this.scaleDown(action.parameters);
        break;
      case 'cache_clear':
        await this.clearCache(action.parameters);
        break;
      case 'gc_force':
        await this.forceGarbageCollection(action.parameters);
        break;
      case 'load_balance':
        await this.adjustLoadBalancing(action.parameters);
        break;
      case 'circuit_breaker':
        await this.toggleCircuitBreaker(action.parameters);
        break;
      case 'rate_limit':
        await this.adjustRateLimit(action.parameters);
        break;
      default:
        this.logger.warn(`Unknown optimization action: ${action.type}`);
    }
  }

  /**
   * Scale up instances
   */
  private async scaleUp(parameters: Record<string, any>): Promise<void> {
    const instances = parameters.instances || 1;
    this.logger.info(`Scaling up by ${instances} instances`);
    // Implementation would interact with orchestration system
    this.emit('scaling', { direction: 'up', instances });
  }

  /**
   * Scale down instances
   */
  private async scaleDown(parameters: Record<string, any>): Promise<void> {
    const instances = parameters.instances || 1;
    this.logger.info(`Scaling down by ${instances} instances`);
    // Implementation would interact with orchestration system
    this.emit('scaling', { direction: 'down', instances });
  }

  /**
   * Clear cache
   */
  private async clearCache(parameters: Record<string, any>): Promise<void> {
    const cacheType = parameters.cacheType || 'all';
    this.logger.info(`Clearing cache: ${cacheType}`);
    // Implementation would clear specific cache
    this.emit('cacheCleared', { cacheType });
  }

  /**
   * Force garbage collection
   */
  private async forceGarbageCollection(parameters: Record<string, any>): Promise<void> {
    this.logger.info('Forcing garbage collection');
    if (global.gc) {
      global.gc();
    }
    this.emit('garbageCollection', { forced: true });
  }

  /**
   * Adjust load balancing
   */
  private async adjustLoadBalancing(parameters: Record<string, any>): Promise<void> {
    const algorithm = parameters.algorithm || 'round_robin';
    this.logger.info(`Adjusting load balancing algorithm to: ${algorithm}`);
    // Implementation would update load balancer configuration
    this.emit('loadBalancingAdjusted', { algorithm });
  }

  /**
   * Toggle circuit breaker
   */
  private async toggleCircuitBreaker(parameters: Record<string, any>): Promise<void> {
    const service = parameters.service;
    const state = parameters.state || 'open';
    this.logger.info(`Circuit breaker ${state} for service: ${service}`);
    // Implementation would toggle circuit breaker
    this.emit('circuitBreakerToggled', { service, state });
  }

  /**
   * Adjust rate limit
   */
  private async adjustRateLimit(parameters: Record<string, any>): Promise<void> {
    const limit = parameters.limit;
    const window = parameters.window || 60;
    this.logger.info(`Adjusting rate limit to ${limit} requests per ${window} seconds`);
    // Implementation would update rate limiter
    this.emit('rateLimitAdjusted', { limit, window });
  }

  /**
   * Get recent metrics
   */
  private getRecentMetrics(seconds: number): PerformanceMetrics[] {
    const cutoff = new Date(Date.now() - seconds * 1000);
    return this.metrics.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Add optimization rule
   */
  addOptimizationRule(rule: OptimizationRule): void {
    this.optimizationRules.set(rule.id, rule);
    this.logger.info(`Added optimization rule: ${rule.name}`);
    this.emit('ruleAdded', rule);
  }

  /**
   * Remove optimization rule
   */
  removeOptimizationRule(ruleId: string): void {
    const rule = this.optimizationRules.get(ruleId);
    if (rule) {
      this.optimizationRules.delete(ruleId);
      this.logger.info(`Removed optimization rule: ${rule.name}`);
      this.emit('ruleRemoved', rule);
    }
  }

  /**
   * Get optimization rules
   */
  getOptimizationRules(): OptimizationRule[] {
    return Array.from(this.optimizationRules.values());
  }

  /**
   * Get performance metrics
   */
  getMetrics(limit?: number): PerformanceMetrics[] {
    const metrics = [...this.metrics];
    return limit ? metrics.slice(-limit) : metrics;
  }

  /**
   * Get current performance status
   */
  getCurrentStatus(): {
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const latest = this.metrics[this.metrics.length - 1];
    if (!latest) {
      return { healthy: true, issues: [], recommendations: [] };
    }
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check CPU usage
    if (latest.cpu.usage > 80) {
      issues.push('High CPU usage');
      recommendations.push('Consider scaling up or optimizing CPU-intensive operations');
    }
    
    // Check memory usage
    if (latest.memory.usage > 85) {
      issues.push('High memory usage');
      recommendations.push('Consider scaling up or optimizing memory usage');
    }
    
    // Check disk usage
    if (latest.disk.usage > 90) {
      issues.push('High disk usage');
      recommendations.push('Consider cleaning up disk space or scaling storage');
    }
    
    // Check response time
    if (latest.application.responseTime > 1000) {
      issues.push('High response time');
      recommendations.push('Consider optimizing application performance or scaling up');
    }
    
    // Check error rate
    if (latest.application.errorRate > 0.05) {
      issues.push('High error rate');
      recommendations.push('Investigate and fix application errors');
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Load scaling configuration
   */
  private loadScalingConfig(): ScalingConfig {
    return {
      minInstances: this.config.get('performance.scaling.minInstances', 1),
      maxInstances: this.config.get('performance.scaling.maxInstances', 10),
      targetCPU: this.config.get('performance.scaling.targetCPU', 70),
      targetMemory: this.config.get('performance.scaling.targetMemory', 80),
      scaleUpThreshold: this.config.get('performance.scaling.scaleUpThreshold', 80),
      scaleDownThreshold: this.config.get('performance.scaling.scaleDownThreshold', 30),
      scaleUpCooldown: this.config.get('performance.scaling.scaleUpCooldown', 300),
      scaleDownCooldown: this.config.get('performance.scaling.scaleDownCooldown', 600)
    };
  }

  /**
   * Load cache configuration
   */
  private loadCacheConfig(): CacheConfig {
    return {
      maxSize: this.config.get('performance.cache.maxSize', 100 * 1024 * 1024), // 100MB
      ttl: this.config.get('performance.cache.ttl', 300000), // 5 minutes
      evictionPolicy: this.config.get('performance.cache.evictionPolicy', 'lru'),
      compression: this.config.get('performance.cache.compression', true),
      persistence: this.config.get('performance.cache.persistence', false)
    };
  }

  /**
   * Load load balancer configuration
   */
  private loadLoadBalancerConfig(): LoadBalancerConfig {
    return {
      algorithm: this.config.get('performance.loadBalancer.algorithm', 'round_robin'),
      healthCheckInterval: this.config.get('performance.loadBalancer.healthCheckInterval', 30000),
      healthCheckTimeout: this.config.get('performance.loadBalancer.healthCheckTimeout', 5000),
      maxRetries: this.config.get('performance.loadBalancer.maxRetries', 3),
      backoffMultiplier: this.config.get('performance.loadBalancer.backoffMultiplier', 2)
    };
  }

  /**
   * Load optimization rules
   */
  private async loadOptimizationRules(): Promise<void> {
    // Load default optimization rules
    const defaultRules: OptimizationRule[] = [
      {
        id: 'high_cpu_scale_up',
        name: 'Scale Up on High CPU',
        description: 'Scale up when CPU usage exceeds 80% for 2 minutes',
        condition: {
          metric: 'cpu.usage',
          operator: 'gt',
          threshold: 80,
          duration: 120,
          aggregation: 'avg'
        },
        action: {
          type: 'scale_up',
          parameters: { instances: 1 },
          cooldown: 300
        },
        enabled: true,
        priority: 1,
        triggerCount: 0
      },
      {
        id: 'low_cpu_scale_down',
        name: 'Scale Down on Low CPU',
        description: 'Scale down when CPU usage is below 30% for 5 minutes',
        condition: {
          metric: 'cpu.usage',
          operator: 'lt',
          threshold: 30,
          duration: 300,
          aggregation: 'avg'
        },
        action: {
          type: 'scale_down',
          parameters: { instances: 1 },
          cooldown: 600
        },
        enabled: true,
        priority: 2,
        triggerCount: 0
      },
      {
        id: 'high_memory_gc',
        name: 'Force GC on High Memory',
        description: 'Force garbage collection when memory usage exceeds 85%',
        condition: {
          metric: 'memory.usage',
          operator: 'gt',
          threshold: 85,
          duration: 60,
          aggregation: 'avg'
        },
        action: {
          type: 'gc_force',
          parameters: {},
          cooldown: 300
        },
        enabled: true,
        priority: 3,
        triggerCount: 0
      }
    ];
    
    defaultRules.forEach(rule => {
      this.optimizationRules.set(rule.id, rule);
    });
  }

  /**
   * Shutdown performance optimizer
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Performance Optimizer...');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }
    
    this.metrics = [];
    this.optimizationRules.clear();
    this.isInitialized = false;
    
    this.logger.info('Performance Optimizer shutdown complete');
  }
}