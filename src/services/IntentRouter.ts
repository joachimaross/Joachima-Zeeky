import { singleton } from 'tsyringe';
import { FeatureRegistry } from './FeatureRegistry';

@singleton()
export class IntentRouter {
  constructor(private featureRegistry: FeatureRegistry) {}

  public async route(intent: string, ...args: any[]): Promise<any> {
    const feature = this.featureRegistry.get(intent);
    if (feature) {
      return feature.action(...args);
    }
    // Handle unknown intent
  }
}
