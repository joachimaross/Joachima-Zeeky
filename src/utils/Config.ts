import * as dotenv from 'dotenv';

dotenv.config();

export class Config {
  static get(key: string, defaultValue?: any): any {
    return process.env[key] || defaultValue;
  }

  static getNumber(key: string, defaultValue?: number): number {
    return Number(this.get(key, defaultValue));
  }

  static getBoolean(key: string, defaultValue?: boolean): boolean {
    return this.get(key, defaultValue) === 'true';
  }
}
