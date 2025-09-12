import { ILifecycleService } from "@/interfaces";
import { ZeekyPlugin } from "./ZeekyPlugin";
import { singleton } from "tsyringe";

@singleton()
export class PluginManager implements ILifecycleService {
  private plugins: ZeekyPlugin[] = [];

  public async start(): Promise<void> {
    await this.loadPlugins();
  }

  public async stop(): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.cleanup();
    }
  }

  private async loadPlugins(): Promise<void> {
    // Dynamically load plugins here
  }
}
