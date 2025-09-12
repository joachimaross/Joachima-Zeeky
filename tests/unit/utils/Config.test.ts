import { Config } from '../../../src/utils/Config';

describe('Config', () => {
  let config: Config;

  beforeEach(() => {
    // Reset environment variables
    delete process.env['NODE_ENV'];
    delete process.env['PORT'];
    delete process.env['HOST'];
    delete process.env['JWT_SECRET'];
    delete process.env['ENCRYPTION_KEY'];
    
    config = new Config();
  });

  describe('constructor', () => {
    it('should create a config instance', () => {
      expect(config).toBeInstanceOf(Config);
    });

    it('should load default configuration', () => {
      expect(config.get('NODE_ENV')).toBe('development');
      expect(config.get('PORT')).toBe(3000);
      expect(config.get('HOST')).toBe('localhost');
    });
  });

  describe('get method', () => {
    it('should return configuration values', () => {
      expect(config.get('NODE_ENV')).toBe('development');
      expect(config.get('PORT')).toBe(3000);
    });

    it('should return undefined for non-existent keys', () => {
      expect(config.get('NON_EXISTENT_KEY')).toBeUndefined();
    });
  });

  describe('getDatabase method', () => {
    it('should return database configuration', () => {
      const dbConfig = config.getDatabase();
      expect(dbConfig).toHaveProperty('POSTGRES_URL');
      expect(dbConfig).toHaveProperty('MONGODB_URL');
      expect(dbConfig).toHaveProperty('REDIS_URL');
    });
  });

  describe('getJWT method', () => {
    it('should return JWT configuration', () => {
      const jwtConfig = config.getJWT();
      expect(jwtConfig).toHaveProperty('SECRET');
      expect(jwtConfig).toHaveProperty('EXPIRES_IN');
      expect(jwtConfig).toHaveProperty('REFRESH_EXPIRES_IN');
    });
  });

  describe('getAI method', () => {
    it('should return AI configuration', () => {
      const aiConfig = config.getAI();
      expect(aiConfig).toHaveProperty('OPENAI_API_KEY');
      expect(aiConfig).toHaveProperty('ANTHROPIC_API_KEY');
      expect(aiConfig).toHaveProperty('GOOGLE_AI_API_KEY');
    });
  });

  describe('getSecurity method', () => {
    it('should return security configuration', () => {
      const securityConfig = config.getSecurity();
      expect(securityConfig).toHaveProperty('ENCRYPTION_KEY');
      expect(securityConfig).toHaveProperty('SALT_ROUNDS');
    });
  });

  describe('getFeatures method', () => {
    it('should return feature flags', () => {
      const features = config.getFeatures();
      expect(features).toHaveProperty('ENABLE_VOICE_COMMANDS');
      expect(features).toHaveProperty('ENABLE_VISION_PROCESSING');
      expect(features).toHaveProperty('ENABLE_SMART_HOME');
      expect(features).toHaveProperty('ENABLE_ENTERPRISE_FEATURES');
    });
  });

  describe('getPerformance method', () => {
    it('should return performance configuration', () => {
      const performance = config.getPerformance();
      expect(performance).toHaveProperty('CACHE_TTL');
      expect(performance).toHaveProperty('MAX_CONCURRENT_REQUESTS');
      expect(performance).toHaveProperty('REQUEST_TIMEOUT');
    });
  });

  describe('getCompliance method', () => {
    it('should return compliance configuration', () => {
      const compliance = config.getCompliance();
      expect(compliance).toHaveProperty('ENABLE_HIPAA_COMPLIANCE');
      expect(compliance).toHaveProperty('ENABLE_CJIS_COMPLIANCE');
      expect(compliance).toHaveProperty('ENABLE_SOC2_COMPLIANCE');
      expect(compliance).toHaveProperty('ENABLE_GDPR_COMPLIANCE');
    });
  });

  describe('environment detection methods', () => {
    it('should detect development environment by default', () => {
      expect(config.isDevelopment()).toBe(true);
      expect(config.isProduction()).toBe(false);
      expect(config.isTest()).toBe(false);
    });

    it('should detect test environment when NODE_ENV is test', () => {
      process.env['NODE_ENV'] = 'test';
      const testConfig = new Config();
      expect(testConfig.isTest()).toBe(true);
      expect(testConfig.isDevelopment()).toBe(false);
      expect(testConfig.isProduction()).toBe(false);
    });

    it('should detect production environment when NODE_ENV is production', () => {
      process.env['NODE_ENV'] = 'production';
      const prodConfig = new Config();
      expect(prodConfig.isProduction()).toBe(true);
      expect(prodConfig.isDevelopment()).toBe(false);
      expect(prodConfig.isTest()).toBe(false);
    });
  });

  describe('validate method', () => {
    it('should return false for default configuration (missing secrets)', () => {
      expect(config.validate()).toBe(false);
    });

    it('should return true when required secrets are set', () => {
      process.env['JWT_SECRET'] = 'test-jwt-secret';
      process.env['ENCRYPTION_KEY'] = 'test-encryption-key';
      const validConfig = new Config();
      expect(validConfig.validate()).toBe(true);
    });
  });
});