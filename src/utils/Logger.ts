import winston from 'winston';

/**
 * Logger utility class for Zeeky
 * Provides structured logging with different levels and formats
 */
export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string) {
    this.context = context;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'zeeky', context: this.context },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });

    // Add file transport in production
    if (process.env.NODE_ENV === 'production') {
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        })
      );
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/combined.log'
        })
      );
    }
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  error(message: string, error?: any, meta?: any): void {
    this.logger.error(message, { error, ...meta });
  }

  // Structured logging methods
  logRequest(requestId: string, method: string, url: string, duration: number): void {
    this.info('Request completed', {
      requestId,
      method,
      url,
      duration
    });
  }

  logError(requestId: string, error: Error, context?: any): void {
    this.error('Request failed', error, {
      requestId,
      context
    });
  }

  logPluginEvent(pluginId: string, event: string, data?: any): void {
    this.info('Plugin event', {
      pluginId,
      event,
      data
    });
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', data?: any): void {
    this.warn('Security event', {
      event,
      severity,
      data
    });
  }
}