import { ILifecycleService } from '@/interfaces';
export declare class PluginManager implements ILifecycleService {
    private plugins;
    start(): Promise<void>;
    stop(): Promise<void>;
    private loadPlugins;
}
//# sourceMappingURL=PluginManager.d.ts.map