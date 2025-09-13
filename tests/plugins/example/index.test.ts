import 'reflect-metadata';
import { container } from 'tsyringe';
import { CreativePlugin } from '@/plugins/CreativePlugin';
import { ProductivityPlugin } from '@/plugins/ProductivityPlugin';
import { Logger } from '@/utils/Logger';
import { ExecutionContext, Intent, Response, ResponseType } from '@/types/ZeekyTypes';

describe('Example Plugins', () => {
  let creativePlugin: CreativePlugin;
  let productivityPlugin: ProductivityPlugin;

  beforeEach(() => {
    container.clearInstances();
    container.register<Logger>(Logger, { useClass: Logger });
    creativePlugin = container.resolve(CreativePlugin);
    productivityPlugin = container.resolve(ProductivityPlugin);
  });

  // Test Cases for Creative Plugin
  describe('CreativePlugin', () => {
    it('should handle the generate_music intent and return a confirmation', async () => {
      const intent: Intent = { name: 'generate_music', confidence: 0.9 };
      const context: ExecutionContext = {
        requestId: 'test-request-id',
        conversation: { history: [], entities: [] },
      };
      const response: Response = await creativePlugin.handleIntent(intent, context);
      expect(response['success']).toBe(true);
      expect(response['type']).toBe(ResponseType.CONFIRMATION);
      expect(response['content']).toBe('Music generation started. You will be notified when it is complete.');
    });

    it('should return an error for an unknown intent', async () => {
      const intent: Intent = { name: 'unknown_intent', confidence: 0.9 };
      const context: ExecutionContext = {
        requestId: 'test-request-id',
        conversation: { history: [], entities: [] },
      };
      const response: Response = await creativePlugin.handleIntent(intent, context);
      expect(response['success']).toBe(false);
      expect(response['type']).toBe(ResponseType.ERROR);
      expect(response['content']).toBe('Failed to handle intent: Unknown intent handler: unknown_intent');
    });
  });

  // Test Cases for Productivity Plugin
  describe('ProductivityPlugin', () => {
    it('should handle the create_task intent and return a confirmation', async () => {
      const intent: Intent = { name: 'create_task', confidence: 0.9 };
      const context: ExecutionContext = {
        requestId: 'test-request-id',
        conversation: { history: [], entities: [] },
      };
      const response: Response = await productivityPlugin.handleIntent(intent, context);
      expect(response['success']).toBe(true);
      expect(response['type']).toBe(ResponseType.CONFIRMATION);
      expect(response['content']).toBe('The task has been created successfully.');
    });

    it('should return an error for an unknown intent', async () => {
      const intent: Intent = { name: 'unknown_intent', confidence: 0.9 };
      const context: ExecutionContext = {
        requestId: 'test-request-id',
        conversation: { history: [], entities: [] },
      };
      const response: Response = await productivityPlugin.handleIntent(intent, context);
      expect(response['success']).toBe(false);
      expect(response['type']).toBe(ResponseType.ERROR);
      expect(response['content']).toBe('Failed to handle intent: Unknown intent handler: unknown_intent');
    });
  });

  // Test Case for Multi-Turn Conversation
  describe('Multi-Turn Conversation', () => {
    it('should handle a complex, multi-turn conversation', async () => {
      // 1. User asks to create a task
      const taskIntent: Intent = { name: 'create_task', confidence: 0.95 };
      const taskContext: ExecutionContext = {
        requestId: 'request-1',
        conversation: { history: [], entities: [] },
      };
      const taskResponse: Response = await productivityPlugin.handleIntent(taskIntent, taskContext);
      expect(taskResponse['success']).toBe(true);
      expect(taskResponse['content']).toBe('The task has been created successfully.');

      // 2. User asks to generate music
      const musicIntent: Intent = { name: 'generate_music', confidence: 0.9 };
      const musicContext: ExecutionContext = {
        requestId: 'request-2',
        conversation: {
          history: [ { role: 'user', content: 'Create a new task' }, { role: 'assistant', content: 'The task has been created successfully.' } ],
          entities: [],
        },
      };
      const musicResponse: Response = await creativePlugin.handleIntent(musicIntent, musicContext);
      expect(musicResponse['success']).toBe(true);
      expect(musicResponse['content']).toBe('Music generation started. You will be notified when it is complete.');

      // 3. User asks an unknown intent to the creative plugin
      const unknownIntent: Intent = { name: 'unknown_intent', confidence: 0.9 };
      const unknownContext: ExecutionContext = {
        requestId: 'request-3',
        conversation: {
          history: [
            { role: 'user', content: 'Create a new task' },
            { role: 'assistant', content: 'The task has been created successfully.' },
            { role: 'user', content: 'Now, generate some music' },
            { role: 'assistant', content: 'Music generation started. You will be notified when it is complete.' }
          ],
          entities: [],
        },
      };
      const unknownResponse: Response = await creativePlugin.handleIntent(unknownIntent, unknownContext);
      expect(unknownResponse['success']).toBe(false);
      expect(unknownResponse['content']).toContain('Unknown intent handler');
    });
  });
});
