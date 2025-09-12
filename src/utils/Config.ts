/**
 * Configuration utility
 * Simple configuration management for Zeeky
 */
export class Config {
  private config: Record<string, any> = {};

  constructor() {
    this.loadFromEnv();
  }

  private loadFromEnv(): void {
    this.config = {
      nodeEnv: process.env['NODE_ENV'] || 'development',
      port: parseInt(process.env['PORT'] || '3000', 10),
      host: process.env['HOST'] || 'localhost',
      logLevel: process.env['LOG_LEVEL'] || 'info',
      debug: process.env['DEBUG'] === 'true',
    };
  }

  get(key: string): any {
    return this.config[key];
  }

  set(key: string, value: any): void {
    this.config[key] = value;
  }

  getAll(): Record<string, any> {
    return { ...this.config };
  }
}