import { singleton } from "tsyringe";
import winston from "winston";

@singleton()
export class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env["LOG_LEVEL"] || "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: "zeeky-ai-assistant" },
      transports: [
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new winston.transports.File({
          filename: "logs/combined.log",
        }),
      ],
    });

    // Add console transport for development
    if (process.env["NODE_ENV"] !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      );
    }
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  public error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.logger.error(message, { error: error?.message, stack: error?.stack, ...meta });
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  public log(level: string, message: string, meta?: Record<string, unknown>): void {
    this.logger.log(level, message, meta);
  }
}
