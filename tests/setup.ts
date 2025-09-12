/**
 * Jest setup file for Zeeky tests
 */

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['LOG_LEVEL'] = 'error';
process.env['JWT_SECRET'] = 'test-secret-key';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/zeeky-test';
process.env['REDIS_URL'] = 'redis://localhost:6379/1';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};