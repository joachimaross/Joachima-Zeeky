/**
 * Zeeky Core Tests
 * Basic smoke tests for the core system
 */

import { ZeekyCore } from '../core/ZeekyCore';

describe('ZeekyCore', () => {
  let core: ZeekyCore;

  beforeEach(() => {
    // Mock the dependencies
    const mockConfig = {
      config: {},
      securityManager: {
        initialize: jest.fn().mockResolvedValue(undefined),
        cleanup: jest.fn().mockResolvedValue(undefined),
        getSecurityStatus: jest.fn().mockResolvedValue({ status: 'healthy' }),
        getHealthStatus: jest.fn().mockResolvedValue('healthy'),
        validateRequest: jest.fn().mockResolvedValue(undefined),
        on: jest.fn(),
      },
      pluginManager: {
        initialize: jest.fn().mockResolvedValue(undefined),
        cleanup: jest.fn().mockResolvedValue(undefined),
        loadPlugins: jest.fn().mockResolvedValue(undefined),
        getPluginStatus: jest.fn().mockResolvedValue([]),
        getHealthStatus: jest.fn().mockResolvedValue('healthy'),
        on: jest.fn(),
      },
      aiManager: {
        initialize: jest.fn().mockResolvedValue(undefined),
        cleanup: jest.fn().mockResolvedValue(undefined),
        getAIStatus: jest.fn().mockResolvedValue({ status: 'healthy' }),
        getHealthStatus: jest.fn().mockResolvedValue('healthy'),
        on: jest.fn(),
      },
      integrationManager: {
        initialize: jest.fn().mockResolvedValue(undefined),
        cleanup: jest.fn().mockResolvedValue(undefined),
        getIntegrationStatus: jest.fn().mockResolvedValue([]),
        getHealthStatus: jest.fn().mockResolvedValue('healthy'),
        on: jest.fn(),
      },
    };

    core = new ZeekyCore(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(core.initialize()).resolves.not.toThrow();
    });

    it('should start successfully after initialization', async () => {
      await core.initialize();
      await expect(core.start()).resolves.not.toThrow();
    });

    it('should stop successfully after starting', async () => {
      await core.initialize();
      await core.start();
      await expect(core.stop()).resolves.not.toThrow();
    });
  });

  describe('system status', () => {
    it('should return system status', async () => {
      await core.initialize();
      const status = await core.getSystemStatus();
      
      expect(status).toHaveProperty('isRunning');
      expect(status).toHaveProperty('isInitialized');
      expect(status).toHaveProperty('uptime');
      expect(status).toHaveProperty('memory');
    });

    it('should return health status', async () => {
      await core.initialize();
      const health = await core.getHealthStatus();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('components');
      expect(health).toHaveProperty('metrics');
    });
  });

  describe('request processing', () => {
    it('should throw error when processing request without initialization', async () => {
      const request = {
        id: 'test-request',
        type: 'text' as any,
        content: 'test content',
        source: 'api' as any,
        timestamp: new Date(),
        userId: 'test-user',
        sessionId: 'test-session',
        deviceId: 'test-device',
        context: {} as any,
        metadata: {} as any,
      };

      await expect(core.processRequest(request)).rejects.toThrow('Core system not running');
    });
  });
});