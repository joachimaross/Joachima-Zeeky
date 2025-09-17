import { singleton } from "tsyringe";
import { Logger } from "./Logger";
import * as fs from "fs/promises";
import * as path from "path";

// Define a type for the configuration object to avoid 'any'
type ConfigValue =
  | string
  | number
  | boolean
  | ConfigObject
  | Array<ConfigValue>;
interface ConfigObject {
  [key: string]: ConfigValue;
}

@singleton()
export class ConfigService {
  private config: ConfigObject;

  constructor(private logger: Logger) {
    this.config = {};
  }

  public async load(): Promise<void> {
    this.logger.info("Loading configuration...");
    const configPath = path.resolve(process.cwd(), "zeeky.config.json");
    try {
      const fileContent = await fs.readFile(configPath, "utf-8");
      this.config = JSON.parse(fileContent) as ConfigObject;
      this.resolveEnvVariables(this.config);
      this.logger.info("Configuration loaded and validated");
    } catch (error) {
      this.logger.error(
        "Failed to load configuration:",
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  private resolveEnvVariables(obj: ConfigObject) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Added hasOwnProperty check
        if (typeof obj[key] === "string") {
          const match = (obj[key] as string).match(/^\${(.*)}$/);
          if (match && match[1]) {
            const envVarName = match[1];
            const envVar = process.env[envVarName];
            if (envVar) {
              obj[key] = envVar;
              this.logger.info(`Resolved env variable for: ${key}`);
            } else {
              this.logger.warn(
                `Environment variable not found for: ${envVarName}`,
              );
            }
          }
        } else if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          this.resolveEnvVariables(obj[key] as ConfigObject);
        }
      }
    }
  }

  public get<T>(key: string): T | undefined {
    const keys = key.split(".");
    let value: ConfigValue | undefined = this.config;

    for (const k of keys) {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        k in (value as ConfigObject)
      ) {
        value = (value as ConfigObject)[k];
      } else {
        return undefined;
      }
    }
    return value as T;
  }
}
