import 'reflect-metadata';
import { SmartHomePlugin } from '@/plugins/example/SmartHomePlugin';
import { Logger } from '@/utils';
import { container } from 'tsyringe';
import { ExecutionContext, Intent } from '@/types/ZeekyTypes';

describe('SmartHomePlugin', () => {
  let plugin: SmartHomePlugin;

  beforeEach(() => {
    // Mock the Logger dependency
    container.register(Logger, {
      useValue: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
    });

    plugin = container.resolve(SmartHomePlugin);
  });

  it('should handle the turnOn intent', async () => {
    const intent: Intent = { name: 'turnOn', confidence: 1.0 };
    const context: ExecutionContext = {};
    const result = await plugin.handleIntent(intent, context);
    expect(result['message']).toBe('Turning on the lights');
  });

  it('should handle the turnOff intent', async () => {
    const intent: Intent = { name: 'turnOff', confidence: 1.0 };
    const context: ExecutionContext = {};
    const result = await plugin.handleIntent(intent, context);
    expect(result['message']).toBe('Turning off the lights');
  });
});
