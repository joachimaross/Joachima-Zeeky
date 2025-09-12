import { singleton } from 'tsyringe';

interface Feature {
  name: string;
  description: string;
  intent: string;
  action: (...args: any[]) => any;
}

@singleton()
export class FeatureRegistry {
  private features: Map<string, Feature> = new Map();

  public register(feature: Feature): void {
    this.features.set(feature.intent, feature);
  }

  public get(intent: string): Feature | undefined {
    return this.features.get(intent);
  }

  public list(): Feature[] {
    return Array.from(this.features.values());
  }
}
