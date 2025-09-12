/**
 * Core Zeeky Type Definitions
 * Central type definitions for the entire Zeeky system
 */

// ============================================================================
// Core System Types
// ============================================================================

export interface ZeekyConfig {
  config: any; // Config type will be imported separately
  securityManager: any; // SecurityManager type will be imported separately
  pluginManager: any; // PluginManager type will be imported separately
  aiManager: any; // AIManager type will be imported separately
  integrationManager: any; // IntegrationManager type will be imported separately
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
// Additional Type Definitions
// ============================================================================

// Basic types for missing interfaces
export interface SecurityLevel {
  level: string;
  permissions: string[];
}

export interface AuditEntry {
  id: string;
  action: string;
  timestamp: Date;
  userId: string;
  details: any;
}

export interface ConversationEntry {
  id: string;
  speaker: string;
  content: string;
  timestamp: Date;
}

export interface Entity {
  name: string;
  value: string;
  confidence: number;
  type: string;
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
  retryPolicy: any;
  fallback: any;
  confidence: number;
}

export interface Sentiment {
  polarity: number;
  confidence: number;
  emotions: string[];
}

export interface Language {
  code: string;
  name: string;
  confidence: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
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
  userId: string;
  startTime: Date;
  lastActivity: Date;
}

export interface UserHistory {
  interactions: any[];
  preferences: any;
  patterns: any;
}

export interface DeviceType {
  type: string;
  capabilities: string[];
}

export interface Capability {
  name: string;
  type: string;
  parameters: any;
}

export interface Sensor {
  id: string;
  type: string;
  value: any;
  timestamp: Date;
}

export interface DeviceStatus {
  online: boolean;
  battery?: number;
  signal?: number;
  lastSeen: Date;
}

export interface NetworkContext {
  type: string;
  speed: number;
  latency: number;
  quality: string;
}

export interface PluginDependency {
  name: string;
  version: string;
  optional: boolean;
}

export interface ExecutionContext {
  requestId: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  permissions: Permission[];
}

export interface Response {
  success: boolean;
  type?: string;
  content?: any;
  data?: any;
  error?: string;
  message?: string;
  metadata?: ResponseMetadata;
  timestamp?: Date;
  latency?: number;
  pluginId?: string;
  requestId?: string;
}

export interface PluginConfiguration {
  [key: string]: any;
}

export interface PluginMetrics {
  calls: number;
  errors: number;
  avgResponseTime: number;
  lastActivity: Date;
}

export interface SystemInfo {
  version: string;
  platform: string;
  arch: string;
  memory: number;
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
  request(url: string, options?: any): Promise<any>;
}

export interface SecurityService {
  validate(token: string): Promise<boolean>;
  encrypt(data: any): Promise<string>;
  decrypt(data: string): Promise<any>;
}

export interface AIService {
  process(text: string): Promise<any>;
}

export interface VoiceService {
  synthesize(text: string): Promise<any>;
  recognize(audio: any): Promise<string>;
}

export interface VisionService {
  analyze(image: any): Promise<any>;
}

export interface IntegrationService {
  connect(config: any): Promise<void>;
  disconnect(): Promise<void>;
}

export interface HomeAutomationService {
  controlDevice(deviceId: string, action: string): Promise<any>;
}

export interface VehicleService {
  getStatus(): Promise<any>;
}

export interface EnterpriseService {
  authenticate(credentials: any): Promise<any>;
}

export interface ConfigurationService {
  get(key: string): any;
  set(key: string, value: any): void;
}

export interface FeatureFlagService {
  isEnabled(feature: string): boolean;
}

export interface MetricsService {
  record(metric: string, value: number): void;
}

export interface LoggingService {
  log(level: string, message: string, data?: any): void;
}

export interface AnalyticsService {
  track(event: string, properties?: any): void;
}

export interface GenerativeService {
  generate(prompt: string): Promise<string>;
}

export interface MLService {
  predict(input: any): Promise<any>;
}

export interface AudioData {
  data: Buffer;
  format: string;
  sampleRate: number;
}

export interface VoiceModel {
  id: string;
  name: string;
  language: string;
  gender: string;
}

export interface ImageData {
  data: Buffer;
  format: string;
  width: number;
  height: number;
}

export interface ObjectDetectionResult {
  objects: Array<{
    label: string;
    confidence: number;
    bbox: number[];
  }>;
}

export interface FaceRecognitionResult {
  faces: Array<{
    identity: string;
    confidence: number;
    landmarks: number[][];
  }>;
}

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBoxes: number[][];
}

export interface SceneAnalysisResult {
  scene: string;
  objects: string[];
  activities: string[];
  confidence: number;
}

export interface APIService {
  call(endpoint: string, data?: any): Promise<any>;
}

export interface IoTService {
  connect(deviceId: string): Promise<void>;
  disconnect(deviceId: string): Promise<void>;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditions: any[];
  actions: any[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface ProtocolSupport {
  mqtt: boolean;
  modbus: boolean;
  http: boolean;
  websocket: boolean;
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
}

export interface RemoteControlService {
  sendCommand(command: string): Promise<any>;
}

export interface NavigationService {
  setDestination(destination: string): Promise<any>;
}

export interface AuthenticationService {
  login(credentials: any): Promise<any>;
  logout(): Promise<void>;
}

export interface AuthorizationService {
  checkPermission(userId: string, permission: string): Promise<boolean>;
}

export interface EncryptionService {
  encrypt(data: any): Promise<string>;
  decrypt(data: string): Promise<any>;
}

export interface AuditService {
  log(action: string, details: any): Promise<void>;
}

export interface ComplianceService {
  validate(data: any): Promise<boolean>;
}

export interface PermissionScope {
  type: string;
  resources: string[];
}

export interface Condition {
  type: string;
  value: any;
}

export interface TimeConstraint {
  start: Date;
  end: Date;
  timezone: string;
}

export interface LocationConstraint {
  type: string;
  coordinates: number[];
  radius: number;
}

export interface ComplianceRequirement {
  standard: string;
  requirements: string[];
}

export interface RetentionPolicy {
  duration: number;
  unit: string;
  autoDelete: boolean;
}

export interface PluginStatus {
  id: string;
  name: string;
  status: string;
  version: string;
  lastActivity: Date;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: string;
  lastActivity: Date;
}

export interface AIStatus {
  status: string;
  models: string[];
  lastUpdate: Date;
}

export interface SecurityStatus {
  status: string;
  threats: any[];
  lastScan: Date;
}

export interface RetryPolicy {
  maxAttempts: number;
  delay: number;
  backoff: string;
}

export interface UIStyle {
  theme: string;
  colors: any;
  fonts: any;
}

export interface UIInteraction {
  type: string;
  enabled: boolean;
}

export interface UIAccessibility {
  screenReader: boolean;
  highContrast: boolean;
  fontSize: number;
}

export interface Emotion {
  type: string;
  intensity: number;
}

export interface VisualStyle {
  theme: string;
  layout: string;
}

export interface Animation {
  type: string;
  duration: number;
}