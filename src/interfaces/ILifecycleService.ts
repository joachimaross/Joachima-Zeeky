export interface ILifecycleService {
  start(): Promise<void>;
  stop(): Promise<void>;
}
