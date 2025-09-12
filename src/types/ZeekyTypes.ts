/**
 * Core Zeeky Type Definitions
 * Central type definitions for the entire Zeeky system
 */

// ============================================================================
// Core System Types
// ============================================================================

export interface ZeekyConfig {
  config: any;
  securityManager: any;
  pluginManager: any;
  aiManager: any;
  integrationManager: any;
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
  apis: APIService;
  iot: IoTService;
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
// Placeholder Types (to be implemented)
// ============================================================================

export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical';
export type AuditEntry = any;
export type ConversationEntry = any;
export type Entity = any;
export type Intent = any;
export type Sentiment = any;
export type UserProfile = any;
export type UserPreferences = any;
export type Role = any;
export type SessionContext = any;
export type UserHistory = any;
export type DeviceType = any;
export type Capability = any;
export type Sensor = any;
export type DeviceStatus = any;
export type NetworkContext = any;
export type PluginDependency = any;
export type ExecutionContext = any;
export type PluginConfiguration = any;
export type PluginMetrics = any;
export type SystemInfo = any;
export type ServiceRegistry = any;
export type StorageService = any;
export type NetworkService = any;
export type VoiceService = any;
export type VisionServiceType = any;
export type EnterpriseService = any;
export type ConfigurationService = any;
export type FeatureFlagService = any;
export type MetricsService = any;
export type LoggingService = any;
export type AnalyticsService = any;
export type GenerativeService = any;
export type MLService = any;
export type Language = any;
export type AudioData = any;
export type VoiceModel = any;
export type ImageData = any;
export type ObjectDetectionResult = any;
export type FaceRecognitionResult = any;
export type OCRResult = any;
export type SceneAnalysisResult = any;
export type APIService = any;
export type IoTService = any;
export type AutomationRule = any;
export type Device = any;
export type ProtocolSupport = any;
export type CarPlayService = any;
export type AndroidAutoService = any;
export type DiagnosticsService = any;
export type RemoteControlService = any;
export type NavigationService = any;
export type AuthenticationService = any;
export type AuthorizationService = any;
export type EncryptionService = any;
export type AuditService = any;
export type ComplianceService = any;
export type PermissionScope = any;
export type Condition = any;
export type TimeConstraint = any;
export type LocationConstraint = any;
export type ComplianceRequirement = any;
export type RetentionPolicy = any;
export type PluginStatus = any;
export type IntegrationStatus = any;
export type AIStatus = any;
export type SecurityStatus = any;
export type RetryPolicy = any;
export type UIStyle = any;
export type UIInteraction = any;
export type UIAccessibility = any;
export type Emotion = any;
export type VisualStyle = any;
export type Animation = any;
export type Response = any;