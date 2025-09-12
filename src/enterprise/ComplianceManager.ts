/**
 * Compliance Manager - Enterprise compliance and security framework
 * Handles HIPAA, CJIS, SOC2, GDPR, and other regulatory requirements
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { Config } from '../utils/Config';

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  lastAudit: Date;
  nextAudit: Date;
  status: 'compliant' | 'non_compliant' | 'partial' | 'pending';
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'implemented' | 'partial' | 'not_implemented' | 'not_applicable';
  evidence: ComplianceEvidence[];
  lastReview: Date;
  nextReview: Date;
}

export interface ComplianceControl {
  id: string;
  title: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'administrative' | 'technical' | 'physical';
  implementation: 'automated' | 'manual' | 'hybrid';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  owner: string;
  status: 'active' | 'inactive' | 'deprecated';
  lastTested: Date;
  nextTest: Date;
  testResults: ComplianceTestResult[];
}

export interface ComplianceEvidence {
  id: string;
  type: 'document' | 'log' | 'screenshot' | 'test_result' | 'policy' | 'procedure';
  title: string;
  description: string;
  filePath?: string;
  url?: string;
  collectedDate: Date;
  collectedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
}

export interface ComplianceTestResult {
  id: string;
  testDate: Date;
  testedBy: string;
  result: 'pass' | 'fail' | 'partial' | 'not_tested';
  details: string;
  remediation?: string;
  nextTestDate: Date;
}

export interface AuditTrail {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'error';
  complianceRelevant: boolean;
}

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  category: 'personal' | 'financial' | 'health' | 'business' | 'technical';
  retentionPeriod: number; // days
  encryptionRequired: boolean;
  accessControls: string[];
  handlingRequirements: string[];
}

export interface PrivacyPolicy {
  id: string;
  name: string;
  version: string;
  effectiveDate: Date;
  dataTypes: string[];
  purposes: string[];
  legalBasis: string[];
  retentionPeriods: Map<string, number>;
  thirdPartySharing: boolean;
  crossBorderTransfer: boolean;
  userRights: string[];
  contactInfo: {
    dpo?: string;
    privacyOfficer?: string;
    email: string;
    phone?: string;
  };
}

export class ComplianceManager extends EventEmitter {
  private logger: Logger;
  private config: Config;
  private frameworks: Map<string, ComplianceFramework> = new Map();
  private auditTrail: AuditTrail[] = [];
  private dataClassifications: Map<string, DataClassification> = new Map();
  private privacyPolicies: Map<string, PrivacyPolicy> = new Map();
  private isInitialized = false;

  constructor(logger: Logger, config: Config) {
    super();
    this.logger = logger;
    this.config = config;
  }

  /**
   * Initialize the compliance manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.info('Initializing Compliance Manager...');
    
    try {
      // Load compliance frameworks
      await this.loadComplianceFrameworks();
      
      // Load data classifications
      await this.loadDataClassifications();
      
      // Load privacy policies
      await this.loadPrivacyPolicies();
      
      // Setup audit trail monitoring
      this.setupAuditTrailMonitoring();
      
      // Setup compliance monitoring
      this.setupComplianceMonitoring();
      
      this.isInitialized = true;
      this.logger.info('Compliance Manager initialized successfully');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Compliance Manager:', error);
      throw error;
    }
  }

  /**
   * Add compliance framework
   */
  addFramework(framework: ComplianceFramework): void {
    this.frameworks.set(framework.id, framework);
    this.logger.info(`Added compliance framework: ${framework.name}`);
    this.emit('frameworkAdded', framework);
  }

  /**
   * Get compliance framework
   */
  getFramework(frameworkId: string): ComplianceFramework | undefined {
    return this.frameworks.get(frameworkId);
  }

  /**
   * Get all frameworks
   */
  getAllFrameworks(): ComplianceFramework[] {
    return Array.from(this.frameworks.values());
  }

  /**
   * Check compliance status
   */
  getComplianceStatus(frameworkId?: string): Map<string, any> {
    const status = new Map();
    
    if (frameworkId) {
      const framework = this.frameworks.get(frameworkId);
      if (framework) {
        status.set(frameworkId, this.calculateFrameworkStatus(framework));
      }
    } else {
      for (const [id, framework] of this.frameworks) {
        status.set(id, this.calculateFrameworkStatus(framework));
      }
    }
    
    return status;
  }

  /**
   * Calculate framework compliance status
   */
  private calculateFrameworkStatus(framework: ComplianceFramework): any {
    const totalRequirements = framework.requirements.length;
    const implementedRequirements = framework.requirements.filter(r => r.status === 'implemented').length;
    const partialRequirements = framework.requirements.filter(r => r.status === 'partial').length;
    const notImplementedRequirements = framework.requirements.filter(r => r.status === 'not_implemented').length;
    
    const compliancePercentage = totalRequirements > 0 ? (implementedRequirements / totalRequirements) * 100 : 0;
    
    let overallStatus: string;
    if (compliancePercentage >= 95) {
      overallStatus = 'compliant';
    } else if (compliancePercentage >= 80) {
      overallStatus = 'partial';
    } else {
      overallStatus = 'non_compliant';
    }
    
    return {
      framework: framework.name,
      overallStatus,
      compliancePercentage: Math.round(compliancePercentage * 100) / 100,
      requirements: {
        total: totalRequirements,
        implemented: implementedRequirements,
        partial: partialRequirements,
        notImplemented: notImplementedRequirements
      },
      lastAudit: framework.lastAudit,
      nextAudit: framework.nextAudit
    };
  }

  /**
   * Log audit trail entry
   */
  logAuditTrail(entry: Omit<AuditTrail, 'id' | 'timestamp'>): void {
    const auditEntry: AuditTrail = {
      id: this.generateId(),
      timestamp: new Date(),
      ...entry
    };
    
    this.auditTrail.push(auditEntry);
    
    // Keep only last 100,000 entries
    if (this.auditTrail.length > 100000) {
      this.auditTrail = this.auditTrail.slice(-100000);
    }
    
    this.logger.debug(`Audit trail logged: ${auditEntry.action} by ${auditEntry.userId}`);
    this.emit('auditTrailLogged', auditEntry);
  }

  /**
   * Get audit trail
   */
  getAuditTrail(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    complianceRelevant?: boolean;
    limit?: number;
  }): AuditTrail[] {
    let filteredTrail = [...this.auditTrail];
    
    if (filters) {
      if (filters.userId) {
        filteredTrail = filteredTrail.filter(entry => entry.userId === filters.userId);
      }
      
      if (filters.action) {
        filteredTrail = filteredTrail.filter(entry => entry.action.includes(filters.action!));
      }
      
      if (filters.resource) {
        filteredTrail = filteredTrail.filter(entry => entry.resource.includes(filters.resource!));
      }
      
      if (filters.startDate) {
        filteredTrail = filteredTrail.filter(entry => entry.timestamp >= filters.startDate!);
      }
      
      if (filters.endDate) {
        filteredTrail = filteredTrail.filter(entry => entry.timestamp <= filters.endDate!);
      }
      
      if (filters.complianceRelevant !== undefined) {
        filteredTrail = filteredTrail.filter(entry => entry.complianceRelevant === filters.complianceRelevant);
      }
      
      if (filters.limit) {
        filteredTrail = filteredTrail.slice(-filters.limit);
      }
    }
    
    return filteredTrail.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Classify data
   */
  classifyData(dataType: string, content: any): DataClassification {
    // Simple classification logic - in real implementation, this would be more sophisticated
    const classification = this.dataClassifications.get(dataType);
    
    if (classification) {
      return classification;
    }
    
    // Default classification based on content analysis
    let level: DataClassification['level'] = 'internal';
    let category: DataClassification['category'] = 'business';
    
    // Check for personal information
    if (this.containsPersonalInfo(content)) {
      level = 'confidential';
      category = 'personal';
    }
    
    // Check for health information
    if (this.containsHealthInfo(content)) {
      level = 'restricted';
      category = 'health';
    }
    
    // Check for financial information
    if (this.containsFinancialInfo(content)) {
      level = 'confidential';
      category = 'financial';
    }
    
    return {
      level,
      category,
      retentionPeriod: this.getRetentionPeriod(category),
      encryptionRequired: level === 'confidential' || level === 'restricted',
      accessControls: this.getAccessControls(level),
      handlingRequirements: this.getHandlingRequirements(level, category)
    };
  }

  /**
   * Check if content contains personal information
   */
  private containsPersonalInfo(content: any): boolean {
    const personalInfoPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
      /\b\d{5}-\d{4}\b/ // ZIP+4
    ];
    
    const contentStr = JSON.stringify(content);
    return personalInfoPatterns.some(pattern => pattern.test(contentStr));
  }

  /**
   * Check if content contains health information
   */
  private containsHealthInfo(content: any): boolean {
    const healthInfoPatterns = [
      /\b(patient|medical|diagnosis|treatment|prescription|medication)\b/i,
      /\b\d{10}\b/, // Medical record number
      /\b(hipaa|phi|protected health information)\b/i
    ];
    
    const contentStr = JSON.stringify(content);
    return healthInfoPatterns.some(pattern => pattern.test(contentStr));
  }

  /**
   * Check if content contains financial information
   */
  private containsFinancialInfo(content: any): boolean {
    const financialInfoPatterns = [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /\b(account|balance|transaction|payment|invoice)\b/i,
      /\b\d{9,12}\b/ // Account number
    ];
    
    const contentStr = JSON.stringify(content);
    return financialInfoPatterns.some(pattern => pattern.test(contentStr));
  }

  /**
   * Get retention period for data category
   */
  private getRetentionPeriod(category: DataClassification['category']): number {
    const retentionPeriods = {
      personal: 2555, // 7 years
      financial: 2555, // 7 years
      health: 2555, // 7 years
      business: 1095, // 3 years
      technical: 365 // 1 year
    };
    
    return retentionPeriods[category] || 365;
  }

  /**
   * Get access controls for data level
   */
  private getAccessControls(level: DataClassification['level']): string[] {
    const accessControls = {
      public: ['read'],
      internal: ['read', 'write'],
      confidential: ['read', 'write', 'encrypt'],
      restricted: ['read', 'write', 'encrypt', 'audit']
    };
    
    return accessControls[level] || ['read'];
  }

  /**
   * Get handling requirements for data
   */
  private getHandlingRequirements(level: DataClassification['level'], category: DataClassification['category']): string[] {
    const requirements = ['secure_transmission', 'access_logging'];
    
    if (level === 'confidential' || level === 'restricted') {
      requirements.push('encryption_at_rest', 'access_control', 'data_masking');
    }
    
    if (category === 'health') {
      requirements.push('hipaa_compliance', 'phi_protection');
    }
    
    if (category === 'personal') {
      requirements.push('gdpr_compliance', 'consent_management');
    }
    
    return requirements;
  }

  /**
   * Add privacy policy
   */
  addPrivacyPolicy(policy: PrivacyPolicy): void {
    this.privacyPolicies.set(policy.id, policy);
    this.logger.info(`Added privacy policy: ${policy.name}`);
    this.emit('privacyPolicyAdded', policy);
  }

  /**
   * Get privacy policy
   */
  getPrivacyPolicy(policyId: string): PrivacyPolicy | undefined {
    return this.privacyPolicies.get(policyId);
  }

  /**
   * Get all privacy policies
   */
  getAllPrivacyPolicies(): PrivacyPolicy[] {
    return Array.from(this.privacyPolicies.values());
  }

  /**
   * Check data processing compliance
   */
  checkDataProcessingCompliance(dataType: string, purpose: string, legalBasis: string): {
    compliant: boolean;
    requirements: string[];
    risks: string[];
  } {
    const policy = this.findApplicablePrivacyPolicy(dataType);
    
    if (!policy) {
      return {
        compliant: false,
        requirements: ['No privacy policy found for data type'],
        risks: ['Unclear data processing basis']
      };
    }
    
    const requirements: string[] = [];
    const risks: string[] = [];
    
    // Check if purpose is allowed
    if (!policy.purposes.includes(purpose)) {
      risks.push(`Purpose '${purpose}' not listed in privacy policy`);
    }
    
    // Check if legal basis is valid
    if (!policy.legalBasis.includes(legalBasis)) {
      risks.push(`Legal basis '${legalBasis}' not listed in privacy policy`);
    }
    
    // Check data type coverage
    if (!policy.dataTypes.includes(dataType)) {
      risks.push(`Data type '${dataType}' not covered by privacy policy`);
    }
    
    // Add standard requirements
    requirements.push('obtain_consent', 'provide_notice', 'enable_rights', 'implement_safeguards');
    
    if (policy.thirdPartySharing) {
      requirements.push('third_party_agreements', 'data_processing_agreements');
    }
    
    if (policy.crossBorderTransfer) {
      requirements.push('adequacy_decision', 'standard_contractual_clauses');
    }
    
    return {
      compliant: risks.length === 0,
      requirements,
      risks
    };
  }

  /**
   * Find applicable privacy policy for data type
   */
  private findApplicablePrivacyPolicy(dataType: string): PrivacyPolicy | undefined {
    for (const policy of this.privacyPolicies.values()) {
      if (policy.dataTypes.includes(dataType)) {
        return policy;
      }
    }
    return undefined;
  }

  /**
   * Setup audit trail monitoring
   */
  private setupAuditTrailMonitoring(): void {
    // Monitor for compliance-relevant events
    setInterval(() => {
      this.analyzeAuditTrail();
    }, 60000); // Every minute
  }

  /**
   * Analyze audit trail for compliance issues
   */
  private analyzeAuditTrail(): void {
    const recentEntries = this.auditTrail.filter(
      entry => entry.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    // Check for suspicious activities
    const suspiciousActivities = recentEntries.filter(entry => 
      entry.result === 'failure' && entry.complianceRelevant
    );
    
    if (suspiciousActivities.length > 10) {
      this.logger.warn(`High number of compliance-relevant failures: ${suspiciousActivities.length}`);
      this.emit('complianceAlert', {
        type: 'high_failure_rate',
        count: suspiciousActivities.length,
        entries: suspiciousActivities
      });
    }
  }

  /**
   * Setup compliance monitoring
   */
  private setupComplianceMonitoring(): void {
    // Check compliance status daily
    setInterval(() => {
      this.checkComplianceStatus();
    }, 24 * 60 * 60 * 1000); // Daily
  }

  /**
   * Check compliance status
   */
  private checkComplianceStatus(): void {
    for (const [frameworkId, framework] of this.frameworks) {
      const status = this.calculateFrameworkStatus(framework);
      
      if (status.overallStatus === 'non_compliant') {
        this.logger.error(`Framework ${framework.name} is non-compliant: ${status.compliancePercentage}%`);
        this.emit('complianceViolation', {
          frameworkId,
          framework: framework.name,
          status
        });
      } else if (status.overallStatus === 'partial') {
        this.logger.warn(`Framework ${framework.name} is partially compliant: ${status.compliancePercentage}%`);
        this.emit('complianceWarning', {
          frameworkId,
          framework: framework.name,
          status
        });
      }
    }
  }

  /**
   * Load compliance frameworks
   */
  private async loadComplianceFrameworks(): Promise<void> {
    // Load default frameworks
    const defaultFrameworks: ComplianceFramework[] = [
      {
        id: 'hipaa',
        name: 'HIPAA',
        version: '2023',
        description: 'Health Insurance Portability and Accountability Act',
        requirements: [],
        controls: [],
        lastAudit: new Date(),
        nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 'gdpr',
        name: 'GDPR',
        version: '2018',
        description: 'General Data Protection Regulation',
        requirements: [],
        controls: [],
        lastAudit: new Date(),
        nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 'soc2',
        name: 'SOC 2',
        version: '2017',
        description: 'Service Organization Control 2',
        requirements: [],
        controls: [],
        lastAudit: new Date(),
        nextAudit: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];
    
    defaultFrameworks.forEach(framework => {
      this.frameworks.set(framework.id, framework);
    });
  }

  /**
   * Load data classifications
   */
  private async loadDataClassifications(): Promise<void> {
    // Load default classifications
    const defaultClassifications: Array<[string, DataClassification]> = [
      ['email', {
        level: 'internal',
        category: 'business',
        retentionPeriod: 1095,
        encryptionRequired: false,
        accessControls: ['read', 'write'],
        handlingRequirements: ['secure_transmission', 'access_logging']
      }],
      ['personal_info', {
        level: 'confidential',
        category: 'personal',
        retentionPeriod: 2555,
        encryptionRequired: true,
        accessControls: ['read', 'write', 'encrypt'],
        handlingRequirements: ['secure_transmission', 'access_logging', 'encryption_at_rest', 'access_control']
      }],
      ['health_info', {
        level: 'restricted',
        category: 'health',
        retentionPeriod: 2555,
        encryptionRequired: true,
        accessControls: ['read', 'write', 'encrypt', 'audit'],
        handlingRequirements: ['secure_transmission', 'access_logging', 'encryption_at_rest', 'access_control', 'hipaa_compliance', 'phi_protection']
      }]
    ];
    
    defaultClassifications.forEach(([type, classification]) => {
      this.dataClassifications.set(type, classification);
    });
  }

  /**
   * Load privacy policies
   */
  private async loadPrivacyPolicies(): Promise<void> {
    // Load default privacy policy
    const defaultPolicy: PrivacyPolicy = {
      id: 'default',
      name: 'Default Privacy Policy',
      version: '1.0',
      effectiveDate: new Date(),
      dataTypes: ['personal_info', 'email', 'usage_data'],
      purposes: ['service_provision', 'analytics', 'communication'],
      legalBasis: ['consent', 'legitimate_interest', 'contract'],
      retentionPeriods: new Map([
        ['personal_info', 2555],
        ['email', 1095],
        ['usage_data', 365]
      ]),
      thirdPartySharing: false,
      crossBorderTransfer: false,
      userRights: ['access', 'rectification', 'erasure', 'portability', 'objection'],
      contactInfo: {
        email: 'privacy@zeeky.ai',
        phone: '+1-555-ZEEKY-AI'
      }
    };
    
    this.privacyPolicies.set(defaultPolicy.id, defaultPolicy);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Shutdown compliance manager
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Compliance Manager...');
    this.frameworks.clear();
    this.auditTrail = [];
    this.dataClassifications.clear();
    this.privacyPolicies.clear();
    this.isInitialized = false;
    this.logger.info('Compliance Manager shutdown complete');
  }
}