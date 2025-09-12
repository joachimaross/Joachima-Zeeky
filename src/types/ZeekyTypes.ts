/**
 * Core Zeeky Type Definitions
 * Central type definitions for the entire Zeeky system
 */

// ============================================================================
// Core System Types
// ============================================================================

export interface ZeekyConfig {
  config: Config;
  securityManager: SecurityManager;
  pluginManager: PluginManager;
  aiManager: AIManager;
  integrationManager: IntegrationManager;
}

export interface ZeekyContext {
  requestId: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  source: RequestSource;
  device: DeviceContext;
  location: LocationContext;
  permissions: Permission[];
  securityLevel: SecurityLevel;
  auditTrail: AuditEntry[];
}

export interface ZeekyRequest {
  id: string;
  type: RequestType;
  content: string;
  source: RequestSource;
  timestamp: Date;
  userId: string;
  sessionId: string;
  deviceId: string;
  context: RequestContext;
  metadata: RequestMetadata;
}

export interface ZeekyResponse {
  id: string;
  requestId: string;
  success: boolean;
  type: ResponseType;
  content: string;
  data?: any;
  error?: Error;
  timestamp: Date;
  latency: number;
  actions: Action[];
  ui: UIElement[];
  voice: VoiceResponse;
  visual: VisualResponse;
  metadata: ResponseMetadata;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export enum RequestType {
  VOICE = 'voice',
  TEXT = 'text',
  GESTURE = 'gesture',
  TOUCH = 'touch',
  API = 'api',
  WEBHOOK = 'webhook'
}

export enum RequestSource {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  WEB = 'web',
  HARDWARE_HUB = 'hardware_hub',
  CAR = 'car',
  SMART_HOME = 'smart_home',
  API = 'api'
}

export enum ResponseType {
  TEXT = 'text',
  VOICE = 'voice',
  VISUAL = 'visual',
  ACTION = 'action',
  DATA = 'data',
  ERROR = 'error',
  CONFIRMATION = 'confirmation',
  PROGRESS = 'progress'
}

export interface RequestContext {
  conversation: ConversationContext;
  user: UserContext;
  device: DeviceContext;
  location: LocationContext;
  environment: EnvironmentContext;
}

export interface RequestMetadata {
  userAgent?: string;
  ipAddress?: string;
  language: string;
  timezone: string;
  features: string[];
  experiments: string[];
}

export interface ResponseMetadata {
  pluginId?: string;
  featureId?: string;
  confidence: number;
  alternatives: string[];
  processingTime: number;
  cacheHit: boolean;
}

// ============================================================================
// Context Types
// ============================================================================

export interface ConversationContext {
  id: string;
  history: ConversationEntry[];
  currentTopic: string;
  entities: Entity[];
  intents: Intent[];
  sentiment: Sentiment;
  language: string;
}

export interface UserContext {
  id: string;
  profile: UserProfile;
  preferences: UserPreferences;
  permissions: Permission[];
  roles: Role[];
  session: SessionContext;
  history: UserHistory;
}

export interface DeviceContext {
  id: string;
  type: DeviceType;
  capabilities: Capability[];
  sensors: Sensor[];
  status: DeviceStatus;
  location: LocationContext;
  network: NetworkContext;
}

export interface LocationContext {
  coordinates?: Coordinates;
  address?: Address;
  venue?: Venue;
  geofence?: Geofence;
  timezone: string;
  country: string;
  region: string;
  city: string;
}

export interface EnvironmentContext {
  time: TimeContext;
  weather: WeatherContext;
  noise: NoiseContext;
  lighting: LightingContext;
  activity: ActivityContext;
}

// ============================================================================
// Plugin System Types
// ============================================================================

export interface ZeekyPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  category: PluginCategory;
  subcategory: string;
  tags: string[];
  priority: PriorityLevel;
  complexity: ComplexityLevel;
  dependencies: PluginDependency[];
  peerDependencies: string[];
  conflicts: string[];
  capabilities: Capability[];
  permissions: Permission[];
  intents: Intent[];
  initialize(context: PluginContext): Promise<void>;
  handleIntent(intent: Intent, context: ExecutionContext): Promise<Response>;
  cleanup(): Promise<void>;
  getConfiguration(): PluginConfiguration;
  updateConfiguration(config: PluginConfiguration): Promise<void>;
  getHealthStatus(): HealthStatus;
  getMetrics(): PluginMetrics;
}

export enum PluginCategory {
  CORE_UTILITIES = 'core_utilities',
  PRODUCTIVITY = 'productivity',
  SMART_HOME = 'smart_home',
  HEALTHCARE = 'healthcare',
  SAFETY_SECURITY = 'safety_security',
  CREATIVE = 'creative',
  ENTERPRISE = 'enterprise',
  MEDIA_ENTERTAINMENT = 'media_entertainment',
  JOB_SITES_INDUSTRIAL = 'job_sites_industrial',
  VEHICLE_CONTROL = 'vehicle_control'
}

export enum PriorityLevel {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  FUTURE = 5
}

export enum ComplexityLevel {
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L'
}

export interface PluginContext {
  system: SystemInfo;
  user: UserContext;
  device: DeviceContext;
  services: ServiceRegistry;
  storage: StorageService;
  network: NetworkService;
  security: SecurityService;
  ai: AIService;
  voice: VoiceService;
  vision: VisionService;
  integrations: IntegrationService;
  home: HomeAutomationService;
  vehicle: VehicleService;
  enterprise: EnterpriseService;
  config: ConfigurationService;
  features: FeatureFlagService;
  metrics: MetricsService;
  logging: LoggingService;
  analytics: AnalyticsService;
}

// ============================================================================
// AI System Types
// ============================================================================

export interface AIService {
  nlp: NLPService;
  speech: SpeechService;
  vision: VisionService;
  generative: GenerativeService;
  ml: MLService;
}

export interface NLPService {
  recognizeIntent(text: string): Promise<Intent>;
  extractEntities(text: string): Promise<Entity[]>;
  analyzeSentiment(text: string): Promise<Sentiment>;
  detectLanguage(text: string): Promise<Language>;
  generateText(prompt: string): Promise<string>;
}

export interface SpeechService {
  recognizeSpeech(audio: AudioData): Promise<string>;
  synthesizeSpeech(text: string): Promise<AudioData>;
  cloneVoice(sample: AudioData): Promise<VoiceModel>;
  detectWakeWord(audio: AudioData): Promise<boolean>;
}

export interface VisionService {
  detectObjects(image: ImageData): Promise<ObjectDetectionResult>;
  recognizeFaces(image: ImageData): Promise<FaceRecognitionResult>;
  readText(image: ImageData): Promise<OCRResult>;
  analyzeScene(image: ImageData): Promise<SceneAnalysisResult>;
}

// ============================================================================
// Integration Types
// ============================================================================

export interface IntegrationService {
  home: HomeAutomationService;
  vehicle: VehicleService;
  enterprise: EnterpriseService;
  apis: any;
  iot: any;
}

export interface HomeAutomationService {
  controlDevice(deviceId: string, action: string, params: any): Promise<Response>;
  activateScene(sceneId: string): Promise<Response>;
  createRule(rule: AutomationRule): Promise<Response>;
  discoverDevices(): Promise<Device[]>;
  protocols: ProtocolSupport;
}

export interface VehicleService {
  carplay: CarPlayService;
  androidAuto: AndroidAutoService;
  diagnostics: DiagnosticsService;
  remote: RemoteControlService;
  navigation: NavigationService;
}

// ============================================================================
// Security Types
// ============================================================================

export interface SecurityService {
  auth: AuthenticationService;
  authorization: AuthorizationService;
  encryption: EncryptionService;
  audit: AuditService;
  compliance: ComplianceService;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  level: PermissionLevel;
  scope: PermissionScope;
  resources: string[];
  actions: string[];
  conditions: Condition[];
  timeConstraints: TimeConstraint[];
  locationConstraints: LocationConstraint[];
  compliance: ComplianceRequirement[];
  auditRequired: boolean;
  retentionPolicy: RetentionPolicy;
}

export enum PermissionCategory {
  SYSTEM = 'system',
  USER_DATA = 'user_data',
  DEVICE_CONTROL = 'device_control',
  NETWORK_ACCESS = 'network_access',
  AI_SERVICES = 'ai_services',
  INTEGRATIONS = 'integrations',
  STORAGE = 'storage',
  COMMUNICATION = 'communication'
}

export enum PermissionLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted'
}

// ============================================================================
// System Status Types
// ============================================================================

export interface SystemStatus {
  isRunning: boolean;
  isInitialized: boolean;
  uptime: number;
  memory: any;
  plugins: PluginStatus[];
  features: number;
  integrations: IntegrationStatus[];
  ai: AIStatus;
  security: SecurityStatus;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  components: {
    core: string;
    plugins: string;
    integrations: string;
    ai: string;
    security: string;
  };
  metrics: {
    responseTime: number;
    errorRate: number;
    activeConnections: number;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Venue {
  name: string;
  type: string;
  category: string;
  rating?: number;
  hours?: string;
}

export interface Geofence {
  id: string;
  name: string;
  type: string;
  coordinates: Coordinates[];
  radius?: number;
  active: boolean;
}

export interface TimeContext {
  current: Date;
  timezone: string;
  dayOfWeek: number;
  isWeekend: boolean;
  isHoliday: boolean;
  season: string;
}

export interface WeatherContext {
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
}

export interface NoiseContext {
  level: number;
  type: string;
  source: string;
  isQuiet: boolean;
  isLoud: boolean;
}

export interface LightingContext {
  level: number;
  type: string;
  color: string;
  isDark: boolean;
  isBright: boolean;
}

export interface ActivityContext {
  type: string;
  intensity: number;
  duration: number;
  location: string;
  isActive: boolean;
}

// ============================================================================
// Action Types
// ============================================================================

export interface Action {
  id: string;
  type: ActionType;
  target: string;
  parameters: Record<string, any>;
  confirmation: ConfirmationLevel;
  timeout: number;
  retryPolicy: RetryPolicy;
}

export enum ActionType {
  DEVICE_CONTROL = 'device_control',
  DATA_ACCESS = 'data_access',
  COMMUNICATION = 'communication',
  AUTOMATION = 'automation',
  INTEGRATION = 'integration',
  AI_PROCESSING = 'ai_processing'
}

export enum ConfirmationLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// ============================================================================
// UI Types
// ============================================================================

export interface UIElement {
  type: UIElementType;
  content: any;
  style: UIStyle;
  interaction: UIInteraction;
  accessibility: UIAccessibility;
}

export enum UIElementType {
  TEXT = 'text',
  BUTTON = 'button',
  INPUT = 'input',
  CARD = 'card',
  LIST = 'list',
  CHART = 'chart',
  MAP = 'map',
  MEDIA = 'media'
}

export interface VoiceResponse {
  text: string;
  audio?: AudioData;
  voice: VoiceModel;
  emotion: Emotion;
  speed: number;
  pitch: number;
}

export interface VisualResponse {
  type: VisualType;
  content: any;
  style: VisualStyle;
  animation: Animation;
}

export enum VisualType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  CHART = 'chart',
  MAP = 'map',
  AR = 'ar',
  VR = 'vr'
}

// ============================================================================
// Missing Type Definitions
// ============================================================================

export interface ExecutionContext {
  requestId: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  source: RequestSource;
  device: DeviceContext;
  location: LocationContext;
  permissions: Permission[];
  securityLevel: SecurityLevel;
  auditTrail: AuditEntry[];
}

export interface Response {
  requestId: string;
  pluginId: string;
  timestamp: Date;
  success: boolean;
  type: ResponseType;
  message: string;
  data?: any;
  error?: any;
  metadata: ResponseMetadata;
}

export interface Intent {
  id: string;
  name: string;
  description: string;
  action: string;
  entities: Entity[];
  parameters: any[];
  context: any;
  requiredEntities: string[];
  optionalEntities: string[];
  validationRules: any[];
  handler: string;
  timeout: number;
  retryPolicy: RetryPolicy;
  fallback: any;
}

export interface Entity {
  name: string;
  value: any;
  confidence: number;
  type: string;
}

export interface SecurityLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  details: any;
}

export interface ConversationEntry {
  id: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  content: string;
  metadata: any;
}

export interface Sentiment {
  score: number;
  magnitude: number;
  label: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: any;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: string;
  notifications: any;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface SessionContext {
  id: string;
  startTime: Date;
  lastActivity: Date;
  device: string;
  location: string;
}

export interface UserHistory {
  interactions: any[];
  preferences: any;
  achievements: any[];
}

export interface DeviceType {
  type: 'mobile' | 'desktop' | 'tablet' | 'smart_home' | 'vehicle' | 'server';
}

export interface Capability {
  id: string;
  name: string;
  type: string;
  parameters: any[];
}

export interface Sensor {
  id: string;
  name: string;
  type: string;
  value: any;
  unit: string;
}

export interface DeviceStatus {
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSeen: Date;
  battery?: number;
  signal?: number;
}

export interface NetworkContext {
  type: 'wifi' | 'cellular' | 'ethernet' | 'bluetooth';
  strength: number;
  speed: number;
}

export interface PluginDependency {
  id: string;
  version: string;
  optional: boolean;
}

export interface PluginConfiguration {
  enabled: boolean;
  autoStart: boolean;
  priority: number;
  features: any;
  experiments: any;
  preferences: any;
  customizations: any[];
  integrations: any[];
  apiKeys: any;
  performance: any;
  caching: any;
  security: any;
  privacy: any;
  compliance: any;
  audit: any;
}

export interface PluginMetrics {
  requests: number;
  errors: number;
  averageResponseTime: number;
  uptime: number;
}

export interface SystemInfo {
  version: string;
  environment: string;
  platform: string;
  architecture: string;
}

export interface ServiceRegistry {
  [key: string]: any;
}

export interface StorageService {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface NetworkService {
  request(url: string, options: any): Promise<any>;
}

export interface SecurityServiceInterface {
  validate(token: string): Promise<boolean>;
  encrypt(data: any): Promise<string>;
  decrypt(data: string): Promise<any>;
}

export interface VoiceService {
  recognize(audio: any): Promise<string>;
  synthesize(text: string): Promise<any>;
}

export interface VisionServiceInterface {
  detect(image: any): Promise<any>;
  recognize(image: any): Promise<any>;
}

export interface EnterpriseService {
  authenticate(credentials: any): Promise<any>;
  authorize(user: any, resource: any): Promise<boolean>;
}

export interface ConfigurationService {
  get(key: string): any;
  set(key: string, value: any): void;
}

export interface FeatureFlagService {
  isEnabled(flag: string): boolean;
  getFlags(): any;
}

export interface MetricsService {
  increment(counter: string): void;
  gauge(gauge: string, value: number): void;
  histogram(histogram: string, value: number): void;
}

export interface LoggingService {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, error?: any, meta?: any): void;
}

export interface AnalyticsService {
  track(event: string, properties: any): void;
  identify(userId: string, traits: any): void;
}

export interface GenerativeService {
  generate(prompt: string): Promise<string>;
  complete(text: string): Promise<string>;
}

export interface MLService {
  predict(input: any): Promise<any>;
  train(data: any): Promise<any>;
}

export interface Language {
  code: string;
  name: string;
  confidence: number;
}

export interface AudioData {
  format: string;
  sampleRate: number;
  data: Buffer;
}

export interface VoiceModel {
  id: string;
  name: string;
  language: string;
  gender: string;
}

export interface ImageData {
  format: string;
  width: number;
  height: number;
  data: Buffer;
}

export interface ObjectDetectionResult {
  objects: any[];
  confidence: number;
}

export interface FaceRecognitionResult {
  faces: any[];
  confidence: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: any[];
}

export interface SceneAnalysisResult {
  scene: string;
  objects: any[];
  confidence: number;
}

export interface CarPlayService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface AndroidAutoService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface DiagnosticsService {
  getStatus(): Promise<any>;
  getErrors(): Promise<any[]>;
}

export interface RemoteControlService {
  lock(): Promise<void>;
  unlock(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface NavigationService {
  getRoute(origin: any, destination: any): Promise<any>;
  getTraffic(): Promise<any>;
}

export interface AuthenticationService {
  login(credentials: any): Promise<any>;
  logout(token: string): Promise<void>;
  refresh(token: string): Promise<any>;
}

export interface AuthorizationService {
  check(user: any, resource: any, action: string): Promise<boolean>;
  grant(user: any, resource: any, action: string): Promise<void>;
  revoke(user: any, resource: any, action: string): Promise<void>;
}

export interface EncryptionService {
  encrypt(data: any): Promise<string>;
  decrypt(data: string): Promise<any>;
  hash(data: string): Promise<string>;
}

export interface AuditService {
  log(action: string, user: any, details: any): Promise<void>;
  getLogs(filters: any): Promise<any[]>;
}

export interface ComplianceService {
  check(data: any, standard: string): Promise<boolean>;
  report(violation: any): Promise<void>;
}

export interface PermissionScope {
  scope: 'user' | 'device' | 'system' | 'global';
}

export interface Condition {
  field: string;
  operator: string;
  value: any;
}

export interface TimeConstraint {
  start: string;
  end: string;
  days: string[];
}

export interface LocationConstraint {
  type: 'geofence' | 'ip' | 'country';
  value: any;
}

export interface ComplianceRequirement {
  standard: string;
  level: string;
  requirements: string[];
}

export interface RetentionPolicy {
  duration: string;
  autoDelete: boolean;
}

export interface PluginStatus {
  id: string;
  name: string;
  version: string;
  status: string;
  lastCheck: Date;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: string;
  lastCheck: Date;
}

export interface AIStatus {
  nlp: string;
  speech: string;
  vision: string;
  generative: string;
  models: any;
}

export interface SecurityStatus {
  authentication: string;
  authorization: string;
  encryption: string;
  audit: string;
  lastThreatCheck: Date;
}

export interface RetryPolicy {
  maxRetries: number;
  backoff: string;
}

export interface UIStyle {
  theme: string;
  colors: any;
  fonts: any;
  spacing: any;
}

export interface UIInteraction {
  type: string;
  handler: string;
  parameters: any;
}

export interface UIAccessibility {
  screenReader: boolean;
  highContrast: boolean;
  largeText: boolean;
  voiceOver: boolean;
}

export interface Emotion {
  type: string;
  intensity: number;
}

export interface VisualStyle {
  theme: string;
  layout: string;
  colors: any;
}

export interface Animation {
  type: string;
  duration: number;
  easing: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditions: any[];
  actions: any[];
  enabled: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  capabilities: string[];
}

export interface ProtocolSupport {
  protocols: string[];
  versions: any;
}

// ============================================================================
// Import statements for external types
// ============================================================================

import { Config } from '@/utils/Config';
import { SecurityManager } from '@/security/SecurityManager';
import { PluginManager } from '@/core/PluginManager';
import { AIManager } from '@/ai/AIManager';
import { IntegrationManager } from '@/integrations/IntegrationManager';