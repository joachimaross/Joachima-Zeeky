import { FeatureRegistry } from './FeatureRegistry';
export declare class IntentRouter {
    private featureRegistry;
    constructor(featureRegistry: FeatureRegistry);
    route(intent: string, ...args: any[]): Promise<any>;
}
//# sourceMappingURL=IntentRouter.d.ts.map