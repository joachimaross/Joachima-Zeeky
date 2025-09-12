import 'reflect-metadata';
import { container } from 'tsyringe';
import { HealthAndFitnessPlugin } from '@/plugins/health/HealthAndFitnessPlugin';
import { Logger } from '@/utils/Logger';
import { ExecutionContext, Intent, Response, ResponseType } from '@/types/ZeekyTypes';

describe('HealthAndFitnessPlugin', () => {
  let plugin: HealthAndFitnessPlugin;

  beforeEach(() => {
    container.clearInstances();
    container.register<Logger>(Logger, { useClass: Logger });
    plugin = container.resolve(HealthAndFitnessPlugin);
    plugin.initialize();
  });

  afterEach(async () => {
    await plugin.cleanup();
  });

  it('should handle the log_workout intent and return a confirmation', async () => {
    const intent: Intent = { name: 'log_workout', confidence: 0.9 };
    const context: ExecutionContext = {
      requestId: 'test-request-id',
      conversation: { history: [], entities: [] },
    };
    const response: Response = await plugin.handleIntent(intent, context);

    expect(response['success']).toBe(true);
    expect(response['type']).toBe(ResponseType.CONFIRMATION);
    expect(response['content']).toBe('Your workout has been successfully logged.');
  });

  it('should return an error for an unknown intent', async () => {
    const intent: Intent = { name: 'unknown_health_intent', confidence: 0.9 };
    const context: ExecutionContext = {
      requestId: 'test-request-id',
      conversation: { history: [], entities: [] },
    };
    const response: Response = await plugin.handleIntent(intent, context);

    expect(response['success']).toBe(false);
    expect(response['type']).toBe(ResponseType.ERROR);
    expect(response['content']).toContain('Unknown intent handler');
  });
});
