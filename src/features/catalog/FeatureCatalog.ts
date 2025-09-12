import { Logger } from '@/utils/Logger';
import { Config } from '@/utils/Config';

/**
 * Feature Catalog for Zeeky
 * Manages the 10,000+ feature catalog with search, filtering, and categorization
 */
export interface Feature {
  id: string;
  title: string;
  description: string;
  category: FeatureCategory;
  subcategory: string;
  priority: PriorityLevel;
  complexity: ComplexityLevel;
  tags: string[];
  dependencies: string[];
  compliance: ComplianceLevel[];
  estimatedEffort: string;
  status: FeatureStatus;
  pluginId?: string;
  version?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum FeatureCategory {
  CORE_UTILITIES = 'core_utilities',
  PRODUCTIVITY = 'productivity',
  SMART_HOME = 'smart_home',
  HEALTHCARE = 'healthcare',
  SAFETY_SECURITY = 'safety_security',
  CREATIVE = 'creative',
  ENTERPRISE = 'enterprise',
  MEDIA_ENTERTAINMENT = 'media_entertainment',
  JOB_SITES_INDUSTRIAL = 'job_sites_industrial',
  VEHICLE_CONTROL = 'vehicle_control'
}

export enum PriorityLevel {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  FUTURE = 5
}

export enum ComplexityLevel {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L'
}

export enum ComplianceLevel {
  NONE = 'none',
  HIPAA = 'hipaa',
  CJIS = 'cjis',
  SOC2 = 'soc2',
  GDPR = 'gdpr',
  PCI_DSS = 'pci_dss'
}

export enum FeatureStatus {
  PLANNED = 'planned',
  IN_DEVELOPMENT = 'in_development',
  IMPLEMENTED = 'implemented',
  DEPRECATED = 'deprecated',
  REMOVED = 'removed'
}

export interface FeatureSearchCriteria {
  query?: string;
  category?: FeatureCategory;
  subcategory?: string;
  priority?: PriorityLevel[];
  complexity?: ComplexityLevel[];
  compliance?: ComplianceLevel[];
  status?: FeatureStatus[];
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface FeatureSearchResult {
  features: Feature[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export class FeatureCatalog {
  private logger: Logger;
  private config: Config;
  private features: Map<string, Feature> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.logger = new Logger('FeatureCatalog');
    this.config = new Config();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Feature catalog already initialized');
      return;
    }

    try {
      this.logger.info('Initializing Feature Catalog...');

      // Load feature data from various sources
      await this.loadFeatureData();

      this.isInitialized = true;
      this.logger.info(`Feature Catalog initialized with ${this.features.size} features`);

    } catch (error) {
      this.logger.error('Failed to initialize Feature Catalog:', error);
      throw error;
    }
  }

  async addFeature(feature: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feature> {
    try {
      const newFeature: Feature = {
        ...feature,
        id: this.generateFeatureId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.features.set(newFeature.id, newFeature);
      this.logger.info(`Added feature: ${newFeature.id} - ${newFeature.title}`);

      return newFeature;
    } catch (error) {
      this.logger.error('Failed to add feature:', error);
      throw error;
    }
  }

  async updateFeature(id: string, updates: Partial<Feature>): Promise<Feature | null> {
    try {
      const feature = this.features.get(id);
      if (!feature) {
        this.logger.warn(`Feature not found: ${id}`);
        return null;
      }

      const updatedFeature: Feature = {
        ...feature,
        ...updates,
        id, // Ensure ID cannot be changed
        updatedAt: new Date()
      };

      this.features.set(id, updatedFeature);
      this.logger.info(`Updated feature: ${id}`);

      return updatedFeature;
    } catch (error) {
      this.logger.error('Failed to update feature:', error);
      throw error;
    }
  }

  async removeFeature(id: string): Promise<boolean> {
    try {
      const feature = this.features.get(id);
      if (!feature) {
        this.logger.warn(`Feature not found: ${id}`);
        return false;
      }

      this.features.delete(id);
      this.logger.info(`Removed feature: ${id}`);

      return true;
    } catch (error) {
      this.logger.error('Failed to remove feature:', error);
      throw error;
    }
  }

  async getFeature(id: string): Promise<Feature | null> {
    return this.features.get(id) || null;
  }

  async searchFeatures(criteria: FeatureSearchCriteria): Promise<FeatureSearchResult> {
    try {
      this.logger.debug('Searching features with criteria:', criteria);

      let filteredFeatures = Array.from(this.features.values());

      // Apply filters
      if (criteria.query) {
        const query = criteria.query.toLowerCase();
        filteredFeatures = filteredFeatures.filter(feature =>
          feature.title.toLowerCase().includes(query) ||
          feature.description.toLowerCase().includes(query) ||
          feature.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      if (criteria.category) {
        filteredFeatures = filteredFeatures.filter(feature =>
          feature.category === criteria.category
        );
      }

      if (criteria.subcategory) {
        filteredFeatures = filteredFeatures.filter(feature =>
          feature.subcategory === criteria.subcategory
        );
      }

      if (criteria.priority) {
        filteredFeatures = filteredFeatures.filter(feature =>
          criteria.priority!.includes(feature.priority)
        );
      }

      if (criteria.complexity) {
        filteredFeatures = filteredFeatures.filter(feature =>
          criteria.complexity!.includes(feature.complexity)
        );
      }

      if (criteria.compliance) {
        filteredFeatures = filteredFeatures.filter(feature =>
          criteria.compliance!.some(comp => feature.compliance.includes(comp))
        );
      }

      if (criteria.status) {
        filteredFeatures = filteredFeatures.filter(feature =>
          criteria.status!.includes(feature.status)
        );
      }

      if (criteria.tags) {
        filteredFeatures = filteredFeatures.filter(feature =>
          criteria.tags!.some(tag => feature.tags.includes(tag))
        );
      }

      // Sort by priority and complexity
      filteredFeatures.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.complexity.localeCompare(b.complexity);
      });

      // Apply pagination
      const limit = criteria.limit || 50;
      const offset = criteria.offset || 0;
      const total = filteredFeatures.length;
      const paginatedFeatures = filteredFeatures.slice(offset, offset + limit);

      const result: FeatureSearchResult = {
        features: paginatedFeatures,
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        hasMore: offset + limit < total
      };

      this.logger.debug(`Search completed: ${paginatedFeatures.length}/${total} features`);
      return result;

    } catch (error) {
      this.logger.error('Failed to search features:', error);
      throw error;
    }
  }

  async getFeaturesByCategory(category: FeatureCategory): Promise<Feature[]> {
    return Array.from(this.features.values()).filter(feature =>
      feature.category === category
    );
  }

  async getFeaturesByPlugin(pluginId: string): Promise<Feature[]> {
    return Array.from(this.features.values()).filter(feature =>
      feature.pluginId === pluginId
    );
  }

  async getFeatureStats(): Promise<{
    total: number;
    byCategory: Record<FeatureCategory, number>;
    byPriority: Record<PriorityLevel, number>;
    byComplexity: Record<ComplexityLevel, number>;
    byStatus: Record<FeatureStatus, number>;
  }> {
    const features = Array.from(this.features.values());
    
    const stats = {
      total: features.length,
      byCategory: {} as Record<FeatureCategory, number>,
      byPriority: {} as Record<PriorityLevel, number>,
      byComplexity: {} as Record<ComplexityLevel, number>,
      byStatus: {} as Record<FeatureStatus, number>
    };

    // Initialize counts
    Object.values(FeatureCategory).forEach(cat => stats.byCategory[cat] = 0);
    Object.values(PriorityLevel).forEach(pri => stats.byPriority[pri] = 0);
    Object.values(ComplexityLevel).forEach(comp => stats.byComplexity[comp] = 0);
    Object.values(FeatureStatus).forEach(stat => stats.byStatus[stat] = 0);

    // Count features
    features.forEach(feature => {
      stats.byCategory[feature.category]++;
      stats.byPriority[feature.priority]++;
      stats.byComplexity[feature.complexity]++;
      stats.byStatus[feature.status]++;
    });

    return stats;
  }

  async importFeaturesFromMarkdown(content: string): Promise<number> {
    try {
      this.logger.info('Importing features from markdown content...');

      // Parse markdown content and extract features
      const importedFeatures = this.parseMarkdownFeatures(content);
      
      let importCount = 0;
      for (const featureData of importedFeatures) {
        await this.addFeature(featureData);
        importCount++;
      }

      this.logger.info(`Imported ${importCount} features from markdown`);
      return importCount;

    } catch (error) {
      this.logger.error('Failed to import features from markdown:', error);
      throw error;
    }
  }

  async exportFeaturesToJson(): Promise<string> {
    try {
      const features = Array.from(this.features.values());
      return JSON.stringify(features, null, 2);
    } catch (error) {
      this.logger.error('Failed to export features to JSON:', error);
      throw error;
    }
  }

  private async loadFeatureData(): Promise<void> {
    // Load features from the existing feature catalog markdown
    try {
      // This would typically load from a database or file system
      // For now, we'll create some sample features
      await this.loadSampleFeatures();
    } catch (error) {
      this.logger.warn('Failed to load feature data, starting with empty catalog:', error);
    }
  }

  private async loadSampleFeatures(): Promise<void> {
    const sampleFeatures = [
      {
        title: 'Voice Command Processing',
        description: 'Process voice commands with wake word detection',
        category: FeatureCategory.CORE_UTILITIES,
        subcategory: 'voice_processing',
        priority: PriorityLevel.CRITICAL,
        complexity: ComplexityLevel.LARGE,
        tags: ['voice', 'speech', 'nlp', 'wake-word'],
        dependencies: ['speech-recognition', 'natural-language-processing'],
        compliance: [ComplianceLevel.NONE],
        estimatedEffort: '4-6 weeks',
        status: FeatureStatus.IN_DEVELOPMENT
      },
      {
        title: 'Smart Home Device Control',
        description: 'Control smart home devices through voice commands',
        category: FeatureCategory.SMART_HOME,
        subcategory: 'device_control',
        priority: PriorityLevel.HIGH,
        complexity: ComplexityLevel.MEDIUM,
        tags: ['smart-home', 'iot', 'device-control', 'automation'],
        dependencies: ['voice-commands', 'device-discovery'],
        compliance: [ComplianceLevel.NONE],
        estimatedEffort: '2-3 weeks',
        status: FeatureStatus.PLANNED
      },
      {
        title: 'Calendar Management',
        description: 'Manage calendar events and appointments',
        category: FeatureCategory.PRODUCTIVITY,
        subcategory: 'calendar',
        priority: PriorityLevel.HIGH,
        complexity: ComplexityLevel.MEDIUM,
        tags: ['calendar', 'scheduling', 'appointments', 'productivity'],
        dependencies: ['google-calendar-api', 'microsoft-graph'],
        compliance: [ComplianceLevel.GDPR],
        estimatedEffort: '3-4 weeks',
        status: FeatureStatus.IMPLEMENTED
      },
      {
        title: 'Health Data Monitoring',
        description: 'Monitor and track health data from various sources',
        category: FeatureCategory.HEALTHCARE,
        subcategory: 'monitoring',
        priority: PriorityLevel.HIGH,
        complexity: ComplexityLevel.LARGE,
        tags: ['health', 'monitoring', 'data', 'medical'],
        dependencies: ['health-apis', 'data-storage', 'encryption'],
        compliance: [ComplianceLevel.HIPAA, ComplianceLevel.GDPR],
        estimatedEffort: '6-8 weeks',
        status: FeatureStatus.PLANNED
      }
    ];

    for (const featureData of sampleFeatures) {
      await this.addFeature(featureData);
    }
  }

  private parseMarkdownFeatures(content: string): Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>[] {
    // Basic markdown parsing - in a real implementation, this would be more sophisticated
    const features: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    
    // For now, return empty array - this would parse the zeeky-feature-catalog.md file
    this.logger.info('Markdown parsing not yet implemented, returning empty feature set');
    
    return features;
  }

  private generateFeatureId(): string {
    return `feat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}