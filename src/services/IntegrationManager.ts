import { singleton } from "tsyringe";
import { ILifecycleService } from "@/interfaces";

interface Integration {
  name: string;
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  getClient: <T>() => T;
}

@singleton()
export class IntegrationManager implements ILifecycleService {
  private integrations: Map<string, Integration> = new Map();

  public register(integration: Integration): void {
    this.integrations.set(integration.name, integration);
  }

  public async start(): Promise<void> {
    for (const integration of this.integrations.values()) {
      await integration.initialize();
    }
  }

  public async stop(): Promise<void> {
    for (const integration of this.integrations.values()) {
      await integration.cleanup();
    }
  }

  public get<T>(name: string): T | undefined {
    const integration = this.integrations.get(name);
    return integration?.getClient<T>();
  }
}
