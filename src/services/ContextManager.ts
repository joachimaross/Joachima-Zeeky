import { singleton } from "tsyringe";

@singleton()
export class ContextManager {
  private context: Map<string, unknown> = new Map();

  public set(key: string, value: unknown): void {
    this.context.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.context.get(key) as T | undefined;
  }

  public has(key: string): boolean {
    return this.context.has(key);
  }

  public delete(key: string): boolean {
    return this.context.delete(key);
  }

  public clear(): void {
    this.context.clear();
  }
}
