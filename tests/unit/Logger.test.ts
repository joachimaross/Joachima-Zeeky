/**
 * Unit tests for Logger utility
 */

import { Logger, LogLevel } from '../../src/utils/Logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('TestLogger', LogLevel.DEBUG);
    // Mock all console methods
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with default log level', () => {
      const defaultLogger = new Logger('DefaultLogger');
      expect(defaultLogger).toBeInstanceOf(Logger);
    });

    it('should create logger with custom log level', () => {
      const debugLogger = new Logger('DebugLogger', LogLevel.DEBUG);
      expect(debugLogger).toBeInstanceOf(Logger);
    });
  });

  describe('logging methods', () => {
    it('should log error messages', () => {
      logger.error('Test error message');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('Test error message')
      );
    });

    it('should log warning messages', () => {
      logger.warn('Test warning message');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.stringContaining('Test warning message')
      );
    });

    it('should log info messages', () => {
      logger.info('Test info message');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.stringContaining('Test info message')
      );
    });

    it('should log debug messages', () => {
      logger.debug('Test debug message');
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        expect.stringContaining('Test debug message')
      );
    });

    it('should include context in log messages', () => {
      logger.info('Test message');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestLogger]'),
        expect.stringContaining('Test message')
      );
    });

    it('should include timestamp in log messages', () => {
      logger.info('Test message');
      expect(console.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        expect.stringContaining('Test message')
      );
    });
  });

  describe('log level filtering', () => {
    it('should not log debug messages when level is INFO', () => {
      const infoLogger = new Logger('InfoLogger', LogLevel.INFO);
      infoLogger.debug('Debug message');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should log error messages when level is INFO', () => {
      const infoLogger = new Logger('InfoLogger', LogLevel.INFO);
      infoLogger.error('Error message');
      expect(console.error).toHaveBeenCalled();
    });
  });
});