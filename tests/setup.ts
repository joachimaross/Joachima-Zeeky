/**
 * Test setup file for Jest
 * This file is run before all tests
 */

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['LOG_LEVEL'] = 'error';
process.env['PORT'] = '3001';

// Mock external dependencies
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    errors: jest.fn(),
    json: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
(global as any).testUtils = {
  createMockRequest: (overrides = {}) => ({
    id: 'test-request-id',
    type: 'text',
    content: 'Test request',
    source: 'web',
    timestamp: new Date(),
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    deviceId: 'test-device-id',
    context: {},
    metadata: {},
    ...overrides,
  }),

  createMockResponse: (overrides = {}) => ({
    id: 'test-response-id',
    requestId: 'test-request-id',
    success: true,
    type: 'text',
    content: 'Test response',
    timestamp: new Date(),
    latency: 100,
    actions: [],
    ui: [],
    voice: {
      text: 'Test response',
      voice: { id: 'default', name: 'Default', language: 'en', gender: 'neutral' },
      emotion: { type: 'neutral', intensity: 0.5 },
      speed: 1.0,
      pitch: 1.0,
    },
    visual: {
      type: 'text',
      content: 'Test response',
      style: {},
      animation: { type: 'none', duration: 0, easing: 'linear' },
    },
    metadata: {
      confidence: 0.95,
      alternatives: [],
      processingTime: 100,
      cacheHit: false,
    },
    ...overrides,
  }),

  createMockContext: (overrides = {}) => ({
    requestId: 'test-request-id',
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    timestamp: new Date(),
    source: 'web',
    device: {
      id: 'test-device-id',
      type: 'desktop',
      capabilities: [],
      sensors: [],
      status: 'active',
    },
    location: {
      timezone: 'UTC',
      country: 'US',
      region: 'CA',
      city: 'San Francisco',
    },
    permissions: [],
    securityLevel: { level: 'medium' },
    auditTrail: [],
    ...overrides,
  }),

  createMockPlugin: (overrides = {}) => ({
    id: 'com.test.plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'Test plugin for unit tests',
    author: 'Test Author',
    license: 'MIT',
    category: 'core_utilities',
    subcategory: 'testing',
    tags: ['test'],
    priority: 1,
    complexity: 'S',
    dependencies: [],
    peerDependencies: [],
    conflicts: [],
    capabilities: ['test_capability'],
    permissions: [],
    intents: [],
    initialize: jest.fn().mockResolvedValue(undefined),
    handleIntent: jest.fn().mockResolvedValue({}),
    cleanup: jest.fn().mockResolvedValue(undefined),
    getConfiguration: jest.fn().mockReturnValue({}),
    updateConfiguration: jest.fn().mockResolvedValue(undefined),
    getHealthStatus: jest.fn().mockReturnValue({ status: 'healthy', lastCheck: new Date() }),
    getMetrics: jest.fn().mockReturnValue({ requests: 0, errors: 0, averageResponseTime: 0, uptime: 0 }),
    ...overrides,
  }),
};

// Extend Jest matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },

  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
});

// Export to make this a module
export {};