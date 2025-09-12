import 'reflect-metadata';
import { container } from 'tsyringe';
import { GeminiPlugin } from '@/plugins/ai/GeminiPlugin';
import { GeminiService } from '@/services/GeminiService';
import { Logger } from '@/utils/Logger';
import { ExecutionContext, Intent, Response, ResponseType } from '@/types/ZeekyTypes';

// Mock the GeminiService
class MockGeminiService extends GeminiService {
  public override async generateText(prompt: string): Promise<string> {
    return `Mock response for: ${prompt}`;
  }
}

describe('GeminiPlugin', () => {
  let plugin: GeminiPlugin;

  beforeEach(() => {
    // Reset the container to ensure clean tests
    container.clearInstances();

    // Register the mock service
    container.register<GeminiService>(GeminiService, {
      useClass: MockGeminiService,
    });
    container.register<Logger>(Logger, { useClass: Logger });

    // Resolve the plugin
    plugin = container.resolve(GeminiPlugin);
  });

  it('should handle the generate_text intent and return a confirmation', async () => {
    const intent: Intent = {
      name: 'generate_text',
      confidence: 0.9,
    };

    const context: ExecutionContext = {
      requestId: 'test-request-id',
      conversation: {
        history: [],
        entities: [{ name: 'prompt', value: 'Hello, world!' }],
      },
    };

    const response: Response = await plugin.handleIntent(intent, context);

    expect(response['success']).toBe(true);
    expect(response['type']).toBe(ResponseType.CONFIRMATION);
    expect(response['content']).toBe('Mock response for: Hello, world!');
  });

  it('should return an error if no prompt is provided', async () => {
    const intent: Intent = {
      name: 'generate_text',
      confidence: 0.9,
    };

    const context: ExecutionContext = {
      requestId: 'test-request-id',
      conversation: {
        history: [],
        entities: [],
      },
    };

    const response: Response = await plugin.handleIntent(intent, context);

    expect(response['success']).toBe(false);
    expect(response['type']).toBe(ResponseType.ERROR);
    expect(response['content']).toBe('Prompt is required to generate text.');
  });

  it('should return an error for an unknown intent', async () => {
    const intent: Intent = {
      name: 'unknown_intent',
      confidence: 0.9,
    };

    const context: ExecutionContext = {
      requestId: 'test-request-id',
      conversation: {
        history: [],
        entities: [],
      },
    };

    const response: Response = await plugin.handleIntent(intent, context);

    expect(response['success']).toBe(false);
    expect(response['type']).toBe(ResponseType.ERROR);
    expect(response['content']).toBe('Unknown intent handler: unknown_intent');
  });
});
