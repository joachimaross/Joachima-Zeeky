import { ILifecycleService } from "@/interfaces";
import { ZeekyPlugin } from "./ZeekyPlugin";
import { singleton } from "tsyringe";

@singleton()
export class PluginManager implements ILifecycleService {
  private plugins: ZeekyPlugin[] = [];

  public register(plugin: ZeekyPlugin): void {
    this.plugins.push(plugin);
  }

  public async start(): Promise<void> {
    await this.loadPlugins();
  }

  public async stop(): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.cleanup();
    }
  }

  private async loadPlugins(): Promise<void> {
    // The loadPlugins method is now a placeholder,
    // as plugins are registered manually.
  }

  public getPlugins(): ZeekyPlugin[] {
    return this.plugins;
  }
}
