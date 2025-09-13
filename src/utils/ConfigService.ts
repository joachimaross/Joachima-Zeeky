import { singleton } from "tsyringe";
import { Logger } from "@/utils";
import * as fs from "fs/promises";
import * as path from "path";

@singleton()
export class ConfigService {
  private config: { [key: string]: unknown };

  constructor(private logger: Logger) {
    this.config = {};
  }

  public async load(): Promise<void> {
    this.logger.info("Loading configuration...");
    const configPath = path.resolve(process.cwd(), "zeeky.config.json");
    try {
      const fileContent = await fs.readFile(configPath, "utf-8");
      const parsedContent = JSON.parse(fileContent);

      if (typeof parsedContent === "object" && parsedContent !== null) {
        this.config = parsedContent;
      } else {
        this.config = {};
      }
      this.logger.info("Configuration loaded");

      // Load Gemini API key from environment variable
      if (process.env["GEMINI_API_KEY"]) {
        if (!this.config["gemini"]) {
          this.config["gemini"] = {};
        }
        (this.config["gemini"] as { [key: string]: unknown })["apiKey"] = process.env["GEMINI_API_KEY"];
        this.logger.info("Gemini API key loaded from environment variable");
      }
    } catch (error) {
      this.logger.error(
        "Failed to load configuration:",
        error instanceof Error ? error : new Error(String(error)),
      );
      throw error;
    }
  }

  public get<T>(key: string): T | undefined {
    const keys = key.split(".");
    let value: unknown = this.config;

    for (const k of keys) {
      if (
        typeof value === "object" &&
        value !== null &&
        Object.prototype.hasOwnProperty.call(value, k)
      ) {
        value = (value as { [key: string]: unknown })[k];
      } else {
        return undefined;
      }
    }
    return value as T;
  }
}
