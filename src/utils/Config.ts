import * as dotenv from "dotenv";

dotenv.config();

export class Config {
  static get<T>(key: string, defaultValue: T): T {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    return value as T;
  }

  static getNumber(key: string, defaultValue: number): number {
    const value = this.get(key, defaultValue.toString());
    return Number(value);
  }

  static getBoolean(key: string, defaultValue: boolean): boolean {
    const value = this.get(key, defaultValue.toString());
    return value === "true";
  }
}
