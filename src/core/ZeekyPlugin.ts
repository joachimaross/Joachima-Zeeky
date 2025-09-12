import { Intent, ExecutionContext, Response, PluginConfiguration, HealthStatus, PluginMetrics } from '@/types/ZeekyTypes';

export abstract class ZeekyPlugin {
  abstract id: string;
  abstract name: string;
  abstract version: string;
  abstract description: string;
  abstract author: string;
  abstract license: string;
  abstract category: string;
  abstract subcategory: string;
  abstract tags: string[];
  abstract priority: number;
  abstract complexity: string;
  abstract dependencies: any[];
  abstract peerDependencies: string[];
  abstract conflicts: string[];
  abstract capabilities: any[];
  abstract permissions: any[];
  abstract intents: any[];

  abstract initialize(context: any): Promise<void>;
  abstract handleIntent(intent: Intent, context: ExecutionContext): Promise<Response>;
  abstract cleanup(): Promise<void>;
  abstract getConfiguration(): PluginConfiguration;
  abstract updateConfiguration(config: PluginConfiguration): Promise<void>;
  abstract getHealthStatus(): HealthStatus;
  abstract getMetrics(): PluginMetrics;
}