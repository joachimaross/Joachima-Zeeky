import {
  Intent,
  ExecutionContext,
  Response,
  PluginConfiguration,
  HealthStatus,
  PluginMetrics,
  PluginDependency,
  Capability,
  Permission,
  PluginContext,
} from "@/types/ZeekyTypes";

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
  abstract dependencies: PluginDependency[];
  abstract peerDependencies: string[];
  abstract conflicts: string[];
  abstract capabilities: Capability[];
  abstract permissions: Permission[];
  abstract intents: Intent[];

  abstract initialize(context: PluginContext): Promise<void>;
  abstract handleIntent(
    intent: Intent,
    context: ExecutionContext,
  ): Promise<Response>;
  abstract cleanup(): Promise<void>;
  abstract getConfiguration(): PluginConfiguration;
  abstract updateConfiguration(config: PluginConfiguration): Promise<void>;
  abstract getHealthStatus(): HealthStatus;
  abstract getMetrics(): PluginMetrics;
}
