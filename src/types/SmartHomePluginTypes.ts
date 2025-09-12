export interface SmartDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: string;
  capabilities: string[];
  location: string;
  protocol: string;
  lastUpdated: Date;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  devices: DeviceAction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceAction {
  deviceId: string;
  action: string;
  brightness?: number;
  color?: string;
  temperature?: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: RuleTrigger;
  condition: RuleCondition;
  action: RuleAction;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleTrigger {
  type: string;
  deviceId: string;
  value?: any;
}

export interface RuleCondition {
  type: string;
  start?: string;
  end?: string;
  value?: any;
}

export interface RuleAction {
  type: string;
  deviceId: string;
  action: string;
  value?: any;
}

export type DeviceType = 'light' | 'thermostat' | 'security' | 'sensor' | 'camera' | 'lock' | 'switch';
