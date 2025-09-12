import { IntegrationManager } from "@/services/IntegrationManager";
import { PluginManager } from "./PluginManager";
import { SecurityManager } from "../security/SecurityManager";
import { Logger } from "@/utils";
import { singleton } from "tsyringe";

@singleton()
export class Core {
  constructor(
    private securityManager: SecurityManager,
    private pluginManager: PluginManager,
    private integrationManager: IntegrationManager,
    private logger: Logger,
  ) {}

  public async initialize(): Promise<void> {
    this.logger.info("Initializing Zeeky Core...");

    await this.securityManager.start();
    await this.pluginManager.start();
    await this.integrationManager.start();

    this.logger.info("Zeeky Core initialized successfully");
  }

  public async processCommand(command: string): Promise<any> {
    this.logger.info(`Processing command: ${command}`);
    // Add your command processing logic here
    return { response: "Command processed successfully" };
  }

  public async cleanup(): Promise<void> {
    this.logger.info("Cleaning up Zeeky Core...");

    await this.integrationManager.stop();
    await this.pluginManager.stop();
    await this.securityManager.stop();

    this.logger.info("Zeeky Core cleaned up successfully");
  }
}
