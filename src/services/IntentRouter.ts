import { singleton } from "tsyringe";
import { FeatureRegistry } from "./FeatureRegistry";

@singleton()
export class IntentRouter {
  constructor(private featureRegistry: FeatureRegistry) {}

  public async route(intent: string, ...args: unknown[]): Promise<unknown> {
    const feature = this.featureRegistry.get(intent);
    if (feature) {
      return feature.action(...args);
    }
    throw new Error(`Intent not found: ${intent}`);
  }
}
