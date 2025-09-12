/**
 * Unit tests for Config utility
 */

import { Config, ConfigOptions } from '../../src/utils/Config';

describe('Config', () => {
  let config: Config;

  beforeEach(() => {
    // Reset environment variables
    delete process.env['PORT'];
    delete process.env['HOST'];
    delete process.env['NODE_ENV'];
    delete process.env['LOG_LEVEL'];
  });

  describe('constructor', () => {
    it('should create config with default values', () => {
      config = new Config();
      expect(config.get('port')).toBe(3000);
      expect(config.get('host')).toBe('localhost');
      expect(config.get('nodeEnv')).toBe('development');
    });

    it('should create config with custom options', () => {
      const options: ConfigOptions = {
        port: 4000,
        host: '0.0.0.0',
        nodeEnv: 'production'
      };
      config = new Config(options);
      expect(config.get('port')).toBe(4000);
      expect(config.get('host')).toBe('0.0.0.0');
      expect(config.get('nodeEnv')).toBe('production');
    });

    it('should use environment variables when available', () => {
      process.env['PORT'] = '5000';
      process.env['HOST'] = '127.0.0.1';
      process.env['NODE_ENV'] = 'test';
      
      config = new Config();
      expect(config.get('port')).toBe(5000);
      expect(config.get('host')).toBe('127.0.0.1');
      expect(config.get('nodeEnv')).toBe('test');
    });
  });

  describe('get method', () => {
    beforeEach(() => {
      config = new Config();
    });

    it('should return undefined for non-existent key', () => {
      expect(config.get('nonExistentKey' as keyof ConfigOptions)).toBeUndefined();
    });

    it('should return correct value for existing key', () => {
      expect(config.get('port')).toBe(3000);
      expect(config.get('host')).toBe('localhost');
    });
  });

  describe('set method', () => {
    beforeEach(() => {
      config = new Config();
    });

    it('should set and retrieve value', () => {
      config.set('port', 8080);
      expect(config.get('port')).toBe(8080);
    });

    it('should override existing value', () => {
      config.set('host', 'newhost');
      expect(config.get('host')).toBe('newhost');
    });
  });

  describe('getAll method', () => {
    beforeEach(() => {
      config = new Config();
    });

    it('should return all configuration options', () => {
      const allConfig = config.getAll();
      expect(allConfig).toHaveProperty('port');
      expect(allConfig).toHaveProperty('host');
      expect(allConfig).toHaveProperty('nodeEnv');
    });

    it('should return a copy of the configuration', () => {
      const allConfig = config.getAll();
      allConfig.port = 9999;
      expect(config.get('port')).not.toBe(9999);
    });
  });

  describe('environment checks', () => {
    it('should correctly identify development environment', () => {
      config = new Config({ nodeEnv: 'development' });
      expect(config.isDevelopment()).toBe(true);
      expect(config.isProduction()).toBe(false);
      expect(config.isTest()).toBe(false);
    });

    it('should correctly identify production environment', () => {
      config = new Config({ nodeEnv: 'production' });
      expect(config.isDevelopment()).toBe(false);
      expect(config.isProduction()).toBe(true);
      expect(config.isTest()).toBe(false);
    });

    it('should correctly identify test environment', () => {
      config = new Config({ nodeEnv: 'test' });
      expect(config.isDevelopment()).toBe(false);
      expect(config.isProduction()).toBe(false);
      expect(config.isTest()).toBe(true);
    });
  });
});