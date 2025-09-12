import { ILifecycleService } from '@/interfaces';
import { Logger } from '@/utils';
export declare class AIManager implements ILifecycleService {
    private logger;
    constructor(logger: Logger);
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=AIManager.d.ts.map