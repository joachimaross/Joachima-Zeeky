import { ZeekyPlugin } from '@/core/ZeekyPlugin';
import { ExecutionContext, Response, Intent, PluginCategory, PriorityLevel, ComplexityLevel, Permission, Capability, PluginConfiguration, HealthStatus, PluginMetrics } from '@/types/ZeekyTypes';
export declare class SmartHomePlugin extends ZeekyPlugin {
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
    private devices;
    private scenes;
    private automationRules;
    constructor();
    initialize(): Promise<void>;
    handleIntent(intent: Intent, context: ExecutionContext): Promise<Response>;
    cleanup(): Promise<void>;
    getConfiguration(): PluginConfiguration;
    updateConfiguration(): Promise<void>;
    getHealthStatus(): HealthStatus;
    getMetrics(): PluginMetrics;
    private handleControlLight;
    private handleTurnOn;
    private handleTurnOff;
    private initializeDevices;
    private setupDeviceMonitoring;
}
//# sourceMappingURL=SmartHomePlugin.d.ts.map