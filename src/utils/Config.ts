import dotenv from 'dotenv';
import { Logger } from './Logger';

// Load environment variables
dotenv.config();

/**
 * Configuration management for Zeeky
 * Centralizes all configuration values and provides type safety
 */
export class Config {
  private logger: Logger;
  private config: Record<string, any>;

  constructor() {
    this.logger = new Logger('Config');
    this.config = {};
    this.loadConfiguration();
  }

  private loadConfiguration(): void {
    // Application Configuration
    this.config.NODE_ENV = process.env.NODE_ENV || 'development';
    this.config.PORT = parseInt(process.env.PORT || '3000', 10);
    this.config.HOST = process.env.HOST || 'localhost';

    // Database Configuration
    this.config.DATABASE = {
      POSTGRES_URL: process.env.POSTGRES_URL || 'postgresql://zeeky:zeeky@localhost:5432/zeeky',
      MONGODB_URL: process.env.MONGODB_URL || 'mongodb://zeeky:zeeky@localhost:27017/zeeky',
      REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
    };

    // JWT Configuration
    this.config.JWT = {
      SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
      REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    };

    // AI Services Configuration
    this.config.AI = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY
    };

    // Security Configuration
    this.config.SECURITY = {
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your_encryption_key_here',
      SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '12', 10)
    };

    // Feature Flags
    this.config.FEATURES = {
      ENABLE_VOICE_COMMANDS: process.env.ENABLE_VOICE_COMMANDS === 'true',
      ENABLE_VISION_PROCESSING: process.env.ENABLE_VISION_PROCESSING === 'true',
      ENABLE_SMART_HOME: process.env.ENABLE_SMART_HOME === 'true',
      ENABLE_ENTERPRISE_FEATURES: process.env.ENABLE_ENTERPRISE_FEATURES === 'true'
    };

    // Performance Configuration
    this.config.PERFORMANCE = {
      CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600', 10),
      MAX_CONCURRENT_REQUESTS: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '100', 10),
      REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10)
    };

    // Compliance Configuration
    this.config.COMPLIANCE = {
      ENABLE_HIPAA_COMPLIANCE: process.env.ENABLE_HIPAA_COMPLIANCE === 'true',
      ENABLE_CJIS_COMPLIANCE: process.env.ENABLE_CJIS_COMPLIANCE === 'true',
      ENABLE_SOC2_COMPLIANCE: process.env.ENABLE_SOC2_COMPLIANCE === 'true',
      ENABLE_GDPR_COMPLIANCE: process.env.ENABLE_GDPR_COMPLIANCE === 'true'
    };

    this.logger.info('Configuration loaded successfully');
  }

  get(key: string): any {
    return this.config[key];
  }

  getDatabase(): any {
    return this.config.DATABASE;
  }

  getJWT(): any {
    return this.config.JWT;
  }

  getAI(): any {
    return this.config.AI;
  }

  getSecurity(): any {
    return this.config.SECURITY;
  }

  getFeatures(): any {
    return this.config.FEATURES;
  }

  getPerformance(): any {
    return this.config.PERFORMANCE;
  }

  getCompliance(): any {
    return this.config.COMPLIANCE;
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  validate(): boolean {
    const required = [
      'JWT.SECRET',
      'SECURITY.ENCRYPTION_KEY'
    ];

    for (const key of required) {
      const value = this.get(key);
      if (!value || value === 'your_jwt_secret_key_here' || value === 'your_encryption_key_here') {
        this.logger.error(`Missing or default configuration value: ${key}`);
        return false;
      }
    }

    return true;
  }
}