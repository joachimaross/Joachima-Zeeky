
/**
 * Core Zeeky Type Definitions
 * Central type definitions for the entire Zeeky system
 */

// ===========================================================================
// Import statements for external types
// ===========================================================================

import { Config } from '@/utils/Config';
import { SecurityManager } from '@/security/SecurityManager';
import { PluginManager } from '@/core/PluginManager';
import { AIManager } from '@/services/AIManager';
import { IntegrationManager } from '@/integrations/IntegrationManager';

// ===========================================================================
// Core System Types
// ===========================================================================

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

// ===========================================================================
// Request/Response Types
// ===========================================================================

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

// ===========================================================================
// Context Types
// ===========================================================================

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

// ===========================================================================
// Plugin System Types
// ===========================================================================

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

// ===========================================================================
// AI System Types
// ===========================================================================

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

// ===========================================================================
// Integration Types
// ===========================================================================

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

// ===========================================================================
// Security Types
// ===========================================================================

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

// ===========================================================================
// System Status Types
// ===========================================================================

export interface SystemStatus {
  isRunning: boolean;
  isInitialized: boolean;
  uptime: number;
  memory: NodeJS.MemoryUsage;
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

// ===========================================================================
// Utility Types
// ===========================================================================

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

// ===========================================================================
// Action Types
// ===========================================================================

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

// ===========================================================================
// UI Types
// ===========================================================================

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

// ===========================================================================
// Missing Type Definitions
// ===========================================================================

export enum SecurityLevel {
  LOW,
  MEDIUM,
  HIGH
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  details: any;
}

export interface ConversationEntry {
  id: string;
  timestamp: Date;
  speaker: string;
  text: string;
}

export interface Entity {
  name: string;
  value: any;
}

export interface Intent {
  name: string;
  confidence: number;
}

export interface Sentiment {
  score: number;
  label: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface UserPreferences {
  theme: string;
}

export interface Role {
  name: string;
}

export interface SessionContext {
  id: string;
  startTime: Date;
}

export interface UserHistory {
  log: string[];
}

export enum DeviceType {
  MOBILE,
  DESKTOP,
  HUB
}

export interface Capability {
  name: string;
}

export interface Sensor {
  name: string;
  value: any;
}

export enum DeviceStatus {
  ONLINE,
  OFFLINE
}

export interface NetworkContext {
  type: string;
  speed: number;
}

export interface PluginDependency {
  name: string;
  version: string;
}

export interface PluginConfiguration {
  [key: string]: any;
}

export interface PluginMetrics {
  [key: string]: any;
}

export interface SystemInfo {
  os: string;
  version: string;
}

export interface ServiceRegistry {
  [key: string]: any;
}

export interface StorageService {
  [key: string]: any;
}

export interface NetworkService {
  [key: string]: any;
}

export interface VoiceService {
  [key: string]: any;
}

export interface EnterpriseService {
  [key: string]: any;
}

export interface ConfigurationService {
  [key: string]: any;
}

export interface FeatureFlagService {
  [key: string]: any;
}

export interface MetricsService {
  [key: string]: any;
}

export interface LoggingService {
  [key: string]: any;
}

export interface AnalyticsService {
  [key: string]: any;
}

export interface GenerativeService {
  [key: string]: any;
}

export interface MLService {
  [key: string]: any;
}

export interface Language {
  name: string;
  code: string;
}

export interface AudioData {
  format: string;
  data: Buffer;
}

export interface VoiceModel {
  name: string;
}

export declare class ImageData {};

export interface ObjectDetectionResult {
  [key: string]: any;
}

export interface FaceRecognitionResult {
  [key: string]: any;
}

export interface OCRResult {
  text: string;
}

export interface SceneAnalysisResult {
  [key: string]: any;
}

export interface APIService {
  [key: string]: any;
}

export interface IoTService {
  [key: string]: any;
}

export interface AutomationRule {
  id: string;
  name: string;
}

export interface Device {
  id: string;
  name: string;
}

export interface ProtocolSupport {
  [key: string]: any;
}

export interface CarPlayService {
  [key: string]: any;
}

export interface AndroidAutoService {
  [key: string]: any;
}

export interface DiagnosticsService {
  [key: string]: any;
}

export interface RemoteControlService {
  [key: string]: any;
}

export interface NavigationService {
  [key: string]: any;
}

export interface AuthenticationService {
  [key: string]: any;
}

export interface AuthorizationService {
  [key: string]: any;
}

export interface EncryptionService {
  [key: string]: any;
}

export interface AuditService {
  [key: string]: any;
}

export interface ComplianceService {
  [key: string]: any;
}

export enum PermissionScope {
  USER,
  DEVICE,
  SYSTEM
}

export interface Condition {
  [key: string]: any;
}

export interface TimeConstraint {
  [key: string]: any;
}

export interface LocationConstraint {
  [key: string]: any;
}

export interface ComplianceRequirement {
  [key: string]: any;
}

export interface RetentionPolicy {
  [key: string]: any;
}

export interface PluginStatus {
  [key: string]: any;
}

export interface IntegrationStatus {
  [key: string]: any;
}

export interface AIStatus {
  [key: string]: any;
}

export interface SecurityStatus {
  [key: string]: any;
}

export interface RetryPolicy {
  [key: string]: any;
}

export interface UIStyle {
  [key: string]: any;
}

export interface UIInteraction {
  [key: string]: any;
}

export interface UIAccessibility {
  [key: string]: any;
}

export interface Emotion {
  [key: string]: any;
}

export interface VisualStyle {
  [key: string]: any;
}

export interface Animation {
  [key: string]: any;
}

export interface Response {
  [key: string]: any;
}

export interface ExecutionContext {
  [key: string]: any;
}

export enum TaskPriority {
  LOW,
  MEDIUM,
  HIGH
}

export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
