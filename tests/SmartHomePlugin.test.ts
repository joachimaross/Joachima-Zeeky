import 'reflect-metadata';
import { SmartHomePlugin } from '@/plugins/SmartHomePlugin';
import { Logger } from '@/utils';
import { container } from 'tsyringe';
import { ExecutionContext, Intent, ResponseType } from '@/types/ZeekyTypes';

describe('SmartHomePlugin', () => {
  let plugin: SmartHomePlugin;

  beforeEach(() => {
    // Mock the Logger dependency to prevent actual logging during tests
    container.register(Logger, {
      useValue: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
    });

    plugin = container.resolve(SmartHomePlugin);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should handle the turnOn intent correctly', async () => {
    const intent: Intent = { name: 'turnOn', confidence: 1.0 };
    const context: ExecutionContext = { requestId: 'test-request-on' };
    const result = await plugin.handleIntent(intent, context);

    expect(result['success']).toBe(true);
    expect(result['type']).toBe(ResponseType.CONFIRMATION);
    expect(result['content']).toBe('All lights have been turned on.');
  });

  it('should handle the turnOff intent correctly', async () => {
    const intent: Intent = { name: 'turnOff', confidence: 1.0 };
    const context: ExecutionContext = { requestId: 'test-request-off' };
    const result = await plugin.handleIntent(intent, context);

    expect(result['success']).toBe(true);
    expect(result['type']).toBe(ResponseType.CONFIRMATION);
    expect(result['content']).toBe('All lights have been turned off.');
  });

  it('should return an error for an unknown intent', async () => {
    const intent: Intent = { name: 'unknown_intent', confidence: 1.0 };
    const context: ExecutionContext = { requestId: 'test-request-unknown' };
    const result = await plugin.handleIntent(intent, context);

    expect(result['success']).toBe(false);
    expect(result['type']).toBe(ResponseType.ERROR);
    expect(result['content']).toBe('Unknown intent handler: unknown_intent');
  });
});
