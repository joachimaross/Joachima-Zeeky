export declare class AppLifecycleManager {
    private core;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    handleRejection(reason: any, promise: Promise<any>): void;
    handleException(error: Error): void;
}
//# sourceMappingURL=AppLifecycleManager.d.ts.map