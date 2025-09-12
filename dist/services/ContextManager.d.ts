export declare class ContextManager {
    private context;
    set(key: string, value: any): void;
    get<T>(key: string): T | undefined;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
}
//# sourceMappingURL=ContextManager.d.ts.map