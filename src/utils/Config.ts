/**
 * Configuration utility for Zeeky system
 */

export interface ConfigOptions {
  port?: number;
  host?: string;
  nodeEnv?: string;
  logLevel?: string;
  databaseUrl?: string;
  redisUrl?: string;
  jwtSecret?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
}

export class Config {
  private options: ConfigOptions;

  constructor(options: ConfigOptions = {}) {
    this.options = {
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST || 'localhost',
      nodeEnv: process.env.NODE_ENV || 'development',
      logLevel: process.env.LOG_LEVEL || 'info',
      databaseUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/zeeky',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      openaiApiKey: process.env.OPENAI_API_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      ...options
    };
  }

  get(key: keyof ConfigOptions): any {
    return this.options[key];
  }

  getAll(): ConfigOptions {
    return { ...this.options };
  }

  set(key: keyof ConfigOptions, value: any): void {
    this.options[key] = value;
  }

  isDevelopment(): boolean {
    return this.options.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.options.nodeEnv === 'production';
  }

  isTest(): boolean {
    return this.options.nodeEnv === 'test';
  }
}