import { AIManager, IntegrationManager } from '@/services';
import { PluginManager } from './PluginManager';
import { SecurityManager } from '../security/SecurityManager';
import { Logger } from '@/utils';
export declare class Core {
    private securityManager;
    private aiManager;
    private pluginManager;
    private integrationManager;
    private logger;
    constructor(securityManager: SecurityManager, aiManager: AIManager, pluginManager: PluginManager, integrationManager: IntegrationManager, logger: Logger);
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=Core.d.ts.map