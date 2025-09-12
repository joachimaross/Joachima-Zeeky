import { ILifecycleService } from '@/interfaces';
interface Integration {
    name: string;
    initialize: () => Promise<void>;
    cleanup: () => Promise<void>;
    getClient: <T>() => T;
}
export declare class IntegrationManager implements ILifecycleService {
    private integrations;
    register(integration: Integration): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    get<T>(name: string): T | undefined;
}
export {};
//# sourceMappingURL=IntegrationManager.d.ts.map