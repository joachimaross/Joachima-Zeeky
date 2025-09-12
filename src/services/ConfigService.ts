import { singleton } from 'tsyringe';
import { Logger } from '@/utils';
import * as fs from 'fs/promises';
import * as path from 'path';

@singleton()
export class ConfigService {
  private config: any;

  constructor(private logger: Logger) {}

  public async load(): Promise<void> {
    this.logger.info('Loading configuration...');
    const configPath = path.resolve(process.cwd(), 'zeeky.config.json');
    try {
      const fileContent = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(fileContent);
      this.logger.info('Configuration loaded');
    } catch (error) {
      this.logger.error('Failed to load configuration:', error);
      throw error;
    }
  }

  public get<T>(key: string): T {
    return this.config[key];
  }
}
