import { Logger } from '@/utils';
export declare class ConfigService {
    private logger;
    private config;
    constructor(logger: Logger);
    load(): Promise<void>;
    get<T>(key: string): T;
}
//# sourceMappingURL=ConfigService.d.ts.map