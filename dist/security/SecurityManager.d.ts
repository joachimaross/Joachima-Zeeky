import { ILifecycleService } from '@/interfaces';
import { Logger } from '@/utils';
export declare class SecurityManager implements ILifecycleService {
    private logger;
    constructor(logger: Logger);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=SecurityManager.d.ts.map