import { ZeekyPlugin } from '@/core/ZeekyPlugin';
import { ExecutionContext, Response, Intent, PluginCategory, PriorityLevel, ComplexityLevel, Permission, Capability, PluginConfiguration, HealthStatus, PluginMetrics } from '@/types/ZeekyTypes';
export declare class CreativePlugin extends ZeekyPlugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
    category: PluginCategory;
    subcategory: string;
    tags: string[];
    priority: PriorityLevel;
    complexity: ComplexityLevel;
    dependencies: never[];
    peerDependencies: never[];
    conflicts: never[];
    capabilities: Capability[];
    permissions: Permission[];
    intents: Intent[];
    private logger;
    private generatedContent;
    private aiModels;
    constructor();
    initialize(): Promise<void>;
    handleIntent(intent: Intent, context: ExecutionContext): Promise<Response>;
    cleanup(): Promise<void>;
    getConfiguration(): PluginConfiguration;
    updateConfiguration(): Promise<void>;
    getHealthStatus(): HealthStatus;
    getMetrics(): PluginMetrics;
    private handleGenerateMusic;
    private initializeAIModels;
    private setupContentCleanup;
}
//# sourceMappingURL=CreativePlugin.d.ts.map