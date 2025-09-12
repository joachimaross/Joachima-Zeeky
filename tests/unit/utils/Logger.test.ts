import { Logger } from '../../../src/utils/Logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('TestLogger');
  });

  describe('constructor', () => {
    it('should create a logger instance with correct context', () => {
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('logging methods', () => {
    it('should call debug method without throwing', () => {
      expect(() => logger.debug('Test debug message')).not.toThrow();
    });

    it('should call info method without throwing', () => {
      expect(() => logger.info('Test info message')).not.toThrow();
    });

    it('should call warn method without throwing', () => {
      expect(() => logger.warn('Test warn message')).not.toThrow();
    });

    it('should call error method without throwing', () => {
      expect(() => logger.error('Test error message')).not.toThrow();
    });
  });

  describe('structured logging methods', () => {
    it('should call logRequest without throwing', () => {
      expect(() => 
        logger.logRequest('test-request-id', 'GET', '/test', 100)
      ).not.toThrow();
    });

    it('should call logError without throwing', () => {
      const error = new Error('Test error');
      expect(() => 
        logger.logError('test-request-id', error, { context: 'test' })
      ).not.toThrow();
    });

    it('should call logPluginEvent without throwing', () => {
      expect(() => 
        logger.logPluginEvent('test-plugin', 'loaded', { version: '1.0.0' })
      ).not.toThrow();
    });

    it('should call logSecurityEvent without throwing', () => {
      expect(() => 
        logger.logSecurityEvent('test-event', 'medium', { details: 'test' })
      ).not.toThrow();
    });
  });
});