/**
 * Advanced Monitor - Comprehensive monitoring and analytics system
 * Handles metrics collection, alerting, dashboards, and observability
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { Config } from '../utils/Config';

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface Alert {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'firing' | 'resolved' | 'silenced';
  createdAt: Date;
  updatedAt: Date;
  lastFired?: Date;
  fireCount: number;
  notifications: NotificationConfig[];
}

export interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'ne';
  threshold: number;
  duration: number; // seconds
  aggregation?: 'avg' | 'max' | 'min' | 'sum' | 'count';
  tags?: Record<string, string>;
}

export interface NotificationConfig {
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'teams' | 'pagerduty';
  endpoint: string;
  template?: string;
  enabled: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  panels: DashboardPanel[];
  refreshInterval: number;
  timeRange: {
    from: string;
    to: string;
  };
  variables: DashboardVariable[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardPanel {
  id: string;
  title: string;
  type: 'graph' | 'singlestat' | 'table' | 'heatmap' | 'histogram' | 'pie';
  targets: PanelTarget[];
  options: Record<string, any>;
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface PanelTarget {
  metric: string;
  aggregation: string;
  filters: Record<string, string>;
  alias?: string;
}

export interface DashboardVariable {
  name: string;
  type: 'query' | 'interval' | 'custom';
  value: string;
  options: string[];
}

export interface Trace {
  id: string;
  operationName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'success' | 'error' | 'timeout';
  tags: Record<string, string>;
  logs: TraceLog[];
  spans: Span[];
}

export interface Span {
  id: string;
  traceId: string;
  parentId?: string;
  operationName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tags: Record<string, string>;
  logs: TraceLog[];
}

export interface TraceLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields: Record<string, any>;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  source: string;
  tags: Record<string, string>;
  fields: Record<string, any>;
  traceId?: string;
  spanId?: string;
}

export class AdvancedMonitor extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private metrics: Map<string, Metric[]> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private traces: Map<string, Trace> = new Map();
  private logs: LogEntry[] = [];
  private isInitialized = false;
  private metricsInterval: NodeJS.Timeout | null = null;
  private alertingInterval: NodeJS.Timeout | null = null;
  private retentionInterval: NodeJS.Timeout | null = null;

  constructor(logger: Logger, config: Config) {
    super();
    this.logger = logger;
    this.config = config;
  }

  /**
   * Initialize the advanced monitor
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.info('Initializing Advanced Monitor...');
    
    try {
      // Load default dashboards
      await this.loadDefaultDashboards();
      
      // Load default alerts
      await this.loadDefaultAlerts();
      
      // Start metrics collection
      this.startMetricsCollection();
      
      // Start alerting engine
      this.startAlertingEngine();
      
      // Start retention management
      this.startRetentionManagement();
      
      this.isInitialized = true;
      this.logger.info('Advanced Monitor initialized successfully');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Advanced Monitor:', error);
      throw error;
    }
  }

  /**
   * Record a metric
   */
  recordMetric(metric: Omit<Metric, 'id' | 'timestamp'>): void {
    const fullMetric: Metric = {
      id: this.generateId(),
      timestamp: new Date(),
      ...metric
    };
    
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }
    
    this.metrics.get(metric.name)!.push(fullMetric);
    
    this.emit('metricRecorded', fullMetric);
  }

  /**
   * Record multiple metrics
   */
  recordMetrics(metrics: Omit<Metric, 'id' | 'timestamp'>[]): void {
    metrics.forEach(metric => this.recordMetric(metric));
  }

  /**
   * Get metrics
   */
  getMetrics(
    metricName: string,
    filters?: {
      tags?: Record<string, string>;
      startTime?: Date;
      endTime?: Date;
      limit?: number;
    }
  ): Metric[] {
    const metricList = this.metrics.get(metricName) || [];
    
    let filtered = metricList;
    
    if (filters) {
      if (filters.tags) {
        filtered = filtered.filter(metric => 
          Object.entries(filters.tags!).every(([key, value]) => 
            metric.tags[key] === value
          )
        );
      }
      
      if (filters.startTime) {
        filtered = filtered.filter(metric => metric.timestamp >= filters.startTime!);
      }
      
      if (filters.endTime) {
        filtered = filtered.filter(metric => metric.timestamp <= filters.endTime!);
      }
      
      if (filters.limit) {
        filtered = filtered.slice(-filters.limit);
      }
    }
    
    return filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get all metric names
   */
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  /**
   * Add alert
   */
  addAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt' | 'fireCount'>): string {
    const fullAlert: Alert = {
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      fireCount: 0,
      ...alert
    };
    
    this.alerts.set(fullAlert.id, fullAlert);
    this.logger.info(`Added alert: ${fullAlert.name}`);
    this.emit('alertAdded', fullAlert);
    
    return fullAlert.id;
  }

  /**
   * Update alert
   */
  updateAlert(alertId: string, updates: Partial<Alert>): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;
    
    const updatedAlert = {
      ...alert,
      ...updates,
      updatedAt: new Date()
    };
    
    this.alerts.set(alertId, updatedAlert);
    this.emit('alertUpdated', updatedAlert);
    
    return true;
  }

  /**
   * Remove alert
   */
  removeAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;
    
    this.alerts.delete(alertId);
    this.logger.info(`Removed alert: ${alert.name}`);
    this.emit('alertRemoved', alert);
    
    return true;
  }

  /**
   * Get alerts
   */
  getAlerts(filters?: {
    status?: Alert['status'];
    severity?: Alert['severity'];
  }): Alert[] {
    let alerts = Array.from(this.alerts.values());
    
    if (filters) {
      if (filters.status) {
        alerts = alerts.filter(alert => alert.status === filters.status);
      }
      
      if (filters.severity) {
        alerts = alerts.filter(alert => alert.severity === filters.severity);
      }
    }
    
    return alerts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Create dashboard
   */
  createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): string {
    const fullDashboard: Dashboard = {
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...dashboard
    };
    
    this.dashboards.set(fullDashboard.id, fullDashboard);
    this.logger.info(`Created dashboard: ${fullDashboard.name}`);
    this.emit('dashboardCreated', fullDashboard);
    
    return fullDashboard.id;
  }

  /**
   * Update dashboard
   */
  updateDashboard(dashboardId: string, updates: Partial<Dashboard>): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;
    
    const updatedDashboard = {
      ...dashboard,
      ...updates,
      updatedAt: new Date()
    };
    
    this.dashboards.set(dashboardId, updatedDashboard);
    this.emit('dashboardUpdated', updatedDashboard);
    
    return true;
  }

  /**
   * Get dashboard
   */
  getDashboard(dashboardId: string): Dashboard | undefined {
    return this.dashboards.get(dashboardId);
  }

  /**
   * Get all dashboards
   */
  getDashboards(): Dashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Record trace
   */
  recordTrace(trace: Omit<Trace, 'id'>): string {
    const fullTrace: Trace = {
      id: this.generateId(),
      ...trace
    };
    
    this.traces.set(fullTrace.id, fullTrace);
    this.emit('traceRecorded', fullTrace);
    
    return fullTrace.id;
  }

  /**
   * Get trace
   */
  getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }

  /**
   * Search traces
   */
  searchTraces(filters: {
    operationName?: string;
    startTime?: Date;
    endTime?: Date;
    status?: Trace['status'];
    tags?: Record<string, string>;
    limit?: number;
  }): Trace[] {
    let traces = Array.from(this.traces.values());
    
    if (filters.operationName) {
      traces = traces.filter(trace => 
        trace.operationName.includes(filters.operationName!)
      );
    }
    
    if (filters.startTime) {
      traces = traces.filter(trace => trace.startTime >= filters.startTime!);
    }
    
    if (filters.endTime) {
      traces = traces.filter(trace => trace.endTime <= filters.endTime!);
    }
    
    if (filters.status) {
      traces = traces.filter(trace => trace.status === filters.status);
    }
    
    if (filters.tags) {
      traces = traces.filter(trace => 
        Object.entries(filters.tags!).every(([key, value]) => 
          trace.tags[key] === value
        )
      );
    }
    
    if (filters.limit) {
      traces = traces.slice(0, filters.limit);
    }
    
    return traces.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  /**
   * Record log entry
   */
  recordLog(log: Omit<LogEntry, 'id' | 'timestamp'>): void {
    const fullLog: LogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      ...log
    };
    
    this.logs.push(fullLog);
    
    // Keep only last 100,000 logs
    if (this.logs.length > 100000) {
      this.logs = this.logs.slice(-100000);
    }
    
    this.emit('logRecorded', fullLog);
  }

  /**
   * Search logs
   */
  searchLogs(filters: {
    level?: LogEntry['level'];
    source?: string;
    message?: string;
    startTime?: Date;
    endTime?: Date;
    tags?: Record<string, string>;
    traceId?: string;
    limit?: number;
  }): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }
    
    if (filters.source) {
      filteredLogs = filteredLogs.filter(log => log.source.includes(filters.source!));
    }
    
    if (filters.message) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(filters.message!.toLowerCase())
      );
    }
    
    if (filters.startTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startTime!);
    }
    
    if (filters.endTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endTime!);
    }
    
    if (filters.tags) {
      filteredLogs = filteredLogs.filter(log => 
        Object.entries(filters.tags!).every(([key, value]) => 
          log.tags[key] === value
        )
      );
    }
    
    if (filters.traceId) {
      filteredLogs = filteredLogs.filter(log => log.traceId === filters.traceId);
    }
    
    if (filters.limit) {
      filteredLogs = filteredLogs.slice(-filters.limit);
    }
    
    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    const interval = this.config.get('monitoring.metricsInterval', 10000); // 10 seconds
    
    this.metricsInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, interval);
  }

  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    const timestamp = new Date();
    
    // CPU metrics
    const cpuUsage = process.cpuUsage();
    this.recordMetric({
      name: 'system.cpu.usage',
      value: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
      unit: 'seconds',
      tags: { host: 'localhost' }
    });
    
    // Memory metrics
    const memoryUsage = process.memoryUsage();
    this.recordMetric({
      name: 'system.memory.heap_used',
      value: memoryUsage.heapUsed,
      unit: 'bytes',
      tags: { host: 'localhost' }
    });
    
    this.recordMetric({
      name: 'system.memory.heap_total',
      value: memoryUsage.heapTotal,
      unit: 'bytes',
      tags: { host: 'localhost' }
    });
    
    this.recordMetric({
      name: 'system.memory.external',
      value: memoryUsage.external,
      unit: 'bytes',
      tags: { host: 'localhost' }
    });
    
    // Uptime
    this.recordMetric({
      name: 'system.uptime',
      value: process.uptime(),
      unit: 'seconds',
      tags: { host: 'localhost' }
    });
  }

  /**
   * Start alerting engine
   */
  private startAlertingEngine(): void {
    const interval = this.config.get('monitoring.alertingInterval', 30000); // 30 seconds
    
    this.alertingInterval = setInterval(() => {
      this.evaluateAlerts();
    }, interval);
  }

  /**
   * Evaluate alerts
   */
  private evaluateAlerts(): void {
    for (const alert of this.alerts.values()) {
      if (alert.status !== 'active') continue;
      
      try {
        const shouldFire = this.evaluateAlertCondition(alert);
        
        if (shouldFire && alert.status !== 'firing') {
          this.fireAlert(alert);
        } else if (!shouldFire && alert.status === 'firing') {
          this.resolveAlert(alert);
        }
      } catch (error) {
        this.logger.error(`Failed to evaluate alert ${alert.name}:`, error);
      }
    }
  }

  /**
   * Evaluate alert condition
   */
  private evaluateAlertCondition(alert: Alert): boolean {
    const condition = alert.condition;
    const metrics = this.getMetrics(condition.metric, {
      tags: condition.tags,
      startTime: new Date(Date.now() - condition.duration * 1000),
      endTime: new Date()
    });
    
    if (!metrics.length) return false;
    
    // Apply aggregation
    let value: number;
    switch (condition.aggregation || 'avg') {
      case 'avg':
        value = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
        break;
      case 'max':
        value = Math.max(...metrics.map(m => m.value));
        break;
      case 'min':
        value = Math.min(...metrics.map(m => m.value));
        break;
      case 'sum':
        value = metrics.reduce((sum, m) => sum + m.value, 0);
        break;
      case 'count':
        value = metrics.length;
        break;
      default:
        value = metrics[metrics.length - 1].value;
    }
    
    // Check condition
    switch (condition.operator) {
      case 'gt':
        return value > condition.threshold;
      case 'lt':
        return value < condition.threshold;
      case 'eq':
        return Math.abs(value - condition.threshold) < 0.001;
      case 'gte':
        return value >= condition.threshold;
      case 'lte':
        return value <= condition.threshold;
      case 'ne':
        return Math.abs(value - condition.threshold) >= 0.001;
      default:
        return false;
    }
  }

  /**
   * Fire alert
   */
  private fireAlert(alert: Alert): void {
    alert.status = 'firing';
    alert.lastFired = new Date();
    alert.fireCount++;
    alert.updatedAt = new Date();
    
    this.alerts.set(alert.id, alert);
    
    this.logger.warn(`Alert fired: ${alert.name}`);
    this.emit('alertFired', alert);
    
    // Send notifications
    this.sendNotifications(alert);
  }

  /**
   * Resolve alert
   */
  private resolveAlert(alert: Alert): void {
    alert.status = 'resolved';
    alert.updatedAt = new Date();
    
    this.alerts.set(alert.id, alert);
    
    this.logger.info(`Alert resolved: ${alert.name}`);
    this.emit('alertResolved', alert);
  }

  /**
   * Send notifications
   */
  private async sendNotifications(alert: Alert): Promise<void> {
    for (const notification of alert.notifications) {
      if (!notification.enabled) continue;
      
      try {
        await this.sendNotification(alert, notification);
      } catch (error) {
        this.logger.error(`Failed to send notification for alert ${alert.name}:`, error);
      }
    }
  }

  /**
   * Send notification
   */
  private async sendNotification(alert: Alert, notification: NotificationConfig): Promise<void> {
    const message = this.formatNotificationMessage(alert, notification);
    
    switch (notification.type) {
      case 'webhook':
        await this.sendWebhookNotification(notification.endpoint, message);
        break;
      case 'slack':
        await this.sendSlackNotification(notification.endpoint, message);
        break;
      case 'email':
        await this.sendEmailNotification(notification.endpoint, message);
        break;
      default:
        this.logger.warn(`Unsupported notification type: ${notification.type}`);
    }
  }

  /**
   * Format notification message
   */
  private formatNotificationMessage(alert: Alert, notification: NotificationConfig): string {
    const template = notification.template || 
      `🚨 Alert: ${alert.name}\n\n` +
      `Description: ${alert.description}\n` +
      `Severity: ${alert.severity.toUpperCase()}\n` +
      `Status: ${alert.status.toUpperCase()}\n` +
      `Fired at: ${alert.lastFired?.toISOString()}\n` +
      `Fire count: ${alert.fireCount}`;
    
    return template;
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(endpoint: string, message: string): Promise<void> {
    // Implementation would send HTTP POST to webhook endpoint
    this.logger.info(`Webhook notification sent to ${endpoint}`);
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(endpoint: string, message: string): Promise<void> {
    // Implementation would send message to Slack
    this.logger.info(`Slack notification sent to ${endpoint}`);
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(endpoint: string, message: string): Promise<void> {
    // Implementation would send email
    this.logger.info(`Email notification sent to ${endpoint}`);
  }

  /**
   * Start retention management
   */
  private startRetentionManagement(): void {
    const interval = this.config.get('monitoring.retentionInterval', 3600000); // 1 hour
    
    this.retentionInterval = setInterval(() => {
      this.cleanupOldData();
    }, interval);
  }

  /**
   * Cleanup old data
   */
  private cleanupOldData(): void {
    const retentionDays = this.config.get('monitoring.retentionDays', 30);
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    
    // Cleanup old metrics
    for (const [metricName, metrics] of this.metrics) {
      const filtered = metrics.filter(metric => metric.timestamp >= cutoffDate);
      this.metrics.set(metricName, filtered);
    }
    
    // Cleanup old traces
    for (const [traceId, trace] of this.traces) {
      if (trace.startTime < cutoffDate) {
        this.traces.delete(traceId);
      }
    }
    
    // Cleanup old logs
    this.logs = this.logs.filter(log => log.timestamp >= cutoffDate);
    
    this.logger.debug('Cleaned up old monitoring data');
  }

  /**
   * Load default dashboards
   */
  private async loadDefaultDashboards(): Promise<void> {
    const systemDashboard: Dashboard = {
      id: 'system',
      name: 'System Overview',
      description: 'System performance and health metrics',
      panels: [
        {
          id: 'cpu_usage',
          title: 'CPU Usage',
          type: 'graph',
          targets: [
            {
              metric: 'system.cpu.usage',
              aggregation: 'avg',
              filters: {}
            }
          ],
          options: {
            yAxis: { min: 0, max: 100 },
            legend: { show: true }
          },
          gridPos: { x: 0, y: 0, w: 6, h: 4 }
        },
        {
          id: 'memory_usage',
          title: 'Memory Usage',
          type: 'graph',
          targets: [
            {
              metric: 'system.memory.heap_used',
              aggregation: 'avg',
              filters: {}
            }
          ],
          options: {
            yAxis: { min: 0 },
            legend: { show: true }
          },
          gridPos: { x: 6, y: 0, w: 6, h: 4 }
        }
      ],
      refreshInterval: 10000,
      timeRange: {
        from: 'now-1h',
        to: 'now'
      },
      variables: [],
      tags: ['system'],
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.dashboards.set(systemDashboard.id, systemDashboard);
  }

  /**
   * Load default alerts
   */
  private async loadDefaultAlerts(): Promise<void> {
    const highCpuAlert: Alert = {
      id: 'high_cpu',
      name: 'High CPU Usage',
      description: 'CPU usage is above 80%',
      condition: {
        metric: 'system.cpu.usage',
        operator: 'gt',
        threshold: 80,
        duration: 300, // 5 minutes
        aggregation: 'avg'
      },
      severity: 'warning',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      fireCount: 0,
      notifications: [
        {
          type: 'webhook',
          endpoint: 'https://hooks.slack.com/services/...',
          enabled: true
        }
      ]
    };
    
    this.alerts.set(highCpuAlert.id, highCpuAlert);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Shutdown advanced monitor
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Advanced Monitor...');
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    if (this.alertingInterval) {
      clearInterval(this.alertingInterval);
      this.alertingInterval = null;
    }
    
    if (this.retentionInterval) {
      clearInterval(this.retentionInterval);
      this.retentionInterval = null;
    }
    
    this.metrics.clear();
    this.alerts.clear();
    this.dashboards.clear();
    this.traces.clear();
    this.logs = [];
    this.isInitialized = false;
    
    this.logger.info('Advanced Monitor shutdown complete');
  }
}