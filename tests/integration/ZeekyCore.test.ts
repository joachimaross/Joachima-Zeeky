/**
 * Integration tests for ZeekyCore
 */

import { ZeekyCore } from '../../src/core/ZeekyCore';
import { Config } from '../../src/utils/Config';
import { SecurityManager } from '../../src/security/SecurityManager';
import { PluginManager } from '../../src/core/PluginManager';
import { AIManager } from '../../src/ai/AIManager';
import { IntegrationManager } from '../../src/integrations/IntegrationManager';

describe('ZeekyCore Integration', () => {
  let core: ZeekyCore;
  let config: Config;
  let securityManager: SecurityManager;
  let pluginManager: PluginManager;
  let aiManager: AIManager;
  let integrationManager: IntegrationManager;

  beforeEach(async () => {
    config = new Config();
    securityManager = new SecurityManager();
    pluginManager = new PluginManager();
    aiManager = new AIManager();
    integrationManager = new IntegrationManager();

    core = new ZeekyCore({
      config,
      securityManager,
      pluginManager,
      aiManager,
      integrationManager
    });
  });

  afterEach(async () => {
    if (core) {
      try {
        await core.stop();
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(core.initialize()).resolves.not.toThrow();
    });

    it('should not initialize twice', async () => {
      await core.initialize();
      await expect(core.initialize()).resolves.not.toThrow();
    });
  });

  describe('startup and shutdown', () => {
    it('should start successfully after initialization', async () => {
      await core.initialize();
      await expect(core.start()).resolves.not.toThrow();
    });

    it('should not start without initialization', async () => {
      await expect(core.start()).rejects.toThrow('Core system must be initialized before starting');
    });

    it('should stop successfully after starting', async () => {
      await core.initialize();
      await core.start();
      await expect(core.stop()).resolves.not.toThrow();
    });

    it('should handle multiple stop calls gracefully', async () => {
      await core.initialize();
      await core.start();
      await core.stop();
      await expect(core.stop()).resolves.not.toThrow();
    });
  });

  describe('system status', () => {
    beforeEach(async () => {
      await core.initialize();
    });

    it('should return system status', async () => {
      const status = await core.getSystemStatus();
      expect(status).toHaveProperty('isRunning');
      expect(status).toHaveProperty('isInitialized');
      expect(status).toHaveProperty('uptime');
      expect(status).toHaveProperty('memory');
      expect(status.isInitialized).toBe(true);
      expect(status.isRunning).toBe(false);
    });

    it('should return health status', async () => {
      const health = await core.getHealthStatus();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('timestamp');
      expect(health).toHaveProperty('components');
      expect(health).toHaveProperty('metrics');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
    });
  });

  describe('request processing', () => {
    beforeEach(async () => {
      await core.initialize();
      await core.start();
    });

    it('should reject requests when not running', async () => {
      await core.stop();
      
      const request = {
        id: 'test-request-1',
        type: 'text' as any,
        content: 'test message',
        source: 'api' as any,
        timestamp: new Date(),
        userId: 'test-user',
        sessionId: 'test-session',
        deviceId: 'test-device',
        context: {} as any,
        metadata: {} as any
      };

      await expect(core.processRequest(request)).rejects.toThrow('Core system not running');
    });

    it('should process valid requests', async () => {
      const request = {
        id: 'test-request-2',
        type: 'text' as any,
        content: 'test message',
        source: 'api' as any,
        timestamp: new Date(),
        userId: 'test-user',
        sessionId: 'test-session',
        deviceId: 'test-device',
        context: {} as any,
        metadata: {} as any
      };

      const response = await core.processRequest(request);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('timestamp');
      expect(response.success).toBe(true);
    });
  });

  describe('events', () => {
    beforeEach(async () => {
      await core.initialize();
      await core.start();
    });

    it('should emit system started event', (done) => {
      core.on('system:started', () => {
        done();
      });

      // Restart to trigger event
      core.stop().then(() => {
        core.start();
      });
    });

    it('should emit system stopped event', (done) => {
      core.on('system:stopped', () => {
        done();
      });

      core.stop();
    });
  });
});