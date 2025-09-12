interface Feature {
    name: string;
    description: string;
    intent: string;
    action: (...args: any[]) => any;
}
export declare class FeatureRegistry {
    private features;
    register(feature: Feature): void;
    get(intent: string): Feature | undefined;
    list(): Feature[];
}
export {};
//# sourceMappingURL=FeatureRegistry.d.ts.map