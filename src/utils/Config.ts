import * as dotenv from "dotenv";

dotenv.config();

export class Config {
  static get<T>(key: string, defaultValue?: T): T {
    return (process.env[key] as T) || defaultValue;
  }

  static getNumber(key: string, defaultValue?: number): number {
    return Number(this.get(key, defaultValue));
  }

  static getBoolean(key: string, defaultValue?: boolean): boolean {
    return this.get(key, defaultValue) === "true";
  }
}
