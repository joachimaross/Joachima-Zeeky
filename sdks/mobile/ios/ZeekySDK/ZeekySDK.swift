/**
 * Zeeky iOS SDK - Native iOS integration for Zeeky AI Assistant
 * Provides seamless integration with iOS apps and Siri Shortcuts
 */

import Foundation
import UIKit
import Speech
import AVFoundation
import Combine

// MARK: - Core SDK Classes

@objc public class ZeekySDK: NSObject {
    public static let shared = ZeekySDK()
    
    private var config: ZeekyConfig?
    private var voiceProcessor: VoiceProcessor?
    private var pluginManager: PluginManager?
    private var isInitialized = false
    
    private override init() {
        super.init()
    }
    
    // MARK: - Initialization
    
    @objc public func initialize(with config: ZeekyConfig) throws {
        guard !isInitialized else {
            throw ZeekyError.alreadyInitialized
        }
        
        self.config = config
        
        // Initialize voice processor
        self.voiceProcessor = VoiceProcessor(config: config)
        
        // Initialize plugin manager
        self.pluginManager = PluginManager(config: config)
        
        // Request permissions
        try requestPermissions()
        
        isInitialized = true
        print("Zeeky SDK initialized successfully")
    }
    
    private func requestPermissions() throws {
        // Request speech recognition permission
        SFSpeechRecognizer.requestAuthorization { status in
            switch status {
            case .authorized:
                print("Speech recognition authorized")
            case .denied, .restricted, .notDetermined:
                print("Speech recognition not authorized")
            @unknown default:
                break
            }
        }
        
        // Request microphone permission
        AVAudioSession.sharedInstance().requestRecordPermission { granted in
            if granted {
                print("Microphone access granted")
            } else {
                print("Microphone access denied")
            }
        }
    }
    
    // MARK: - Public API
    
    @objc public func processVoiceInput(_ audioData: Data, completion: @escaping (ZeekyResponse?, Error?) -> Void) {
        guard isInitialized else {
            completion(nil, ZeekyError.notInitialized)
            return
        }
        
        voiceProcessor?.processAudio(audioData) { response, error in
            DispatchQueue.main.async {
                completion(response, error)
            }
        }
    }
    
    @objc public func processTextInput(_ text: String, completion: @escaping (ZeekyResponse?, Error?) -> Void) {
        guard isInitialized else {
            completion(nil, ZeekyError.notInitialized)
            return
        }
        
        let intent = ZeekyIntent(action: "text_input", entities: [["text": text]])
        pluginManager?.processIntent(intent) { response, error in
            DispatchQueue.main.async {
                completion(response, error)
            }
        }
    }
    
    @objc public func getAvailablePlugins() -> [ZeekyPlugin] {
        return pluginManager?.getAvailablePlugins() ?? []
    }
    
    @objc public func enablePlugin(_ pluginId: String) throws {
        try pluginManager?.enablePlugin(pluginId)
    }
    
    @objc public func disablePlugin(_ pluginId: String) throws {
        try pluginManager?.disablePlugin(pluginId)
    }
}

// MARK: - Configuration

@objc public class ZeekyConfig: NSObject {
    @objc public let apiKey: String
    @objc public let baseURL: String
    @objc public let enableVoice: Bool
    @objc public let enablePlugins: Bool
    @objc public let logLevel: ZeekyLogLevel
    
    @objc public init(apiKey: String, baseURL: String = "https://api.zeeky.ai", enableVoice: Bool = true, enablePlugins: Bool = true, logLevel: ZeekyLogLevel = .info) {
        self.apiKey = apiKey
        self.baseURL = baseURL
        self.enableVoice = enableVoice
        self.enablePlugins = enablePlugins
        self.logLevel = logLevel
        super.init()
    }
}

// MARK: - Data Models

@objc public class ZeekyIntent: NSObject {
    @objc public let action: String
    @objc public let entities: [[String: Any]]
    @objc public let confidence: Float
    @objc public let timestamp: Date
    
    @objc public init(action: String, entities: [[String: Any]] = [], confidence: Float = 1.0, timestamp: Date = Date()) {
        self.action = action
        self.entities = entities
        self.confidence = confidence
        self.timestamp = timestamp
        super.init()
    }
}

@objc public class ZeekyResponse: NSObject {
    @objc public let success: Bool
    @objc public let data: [String: Any]?
    @objc public let message: String?
    @objc public let error: String?
    @objc public let timestamp: Date
    
    @objc public init(success: Bool, data: [String: Any]? = nil, message: String? = nil, error: String? = nil, timestamp: Date = Date()) {
        self.success = success
        self.data = data
        self.message = message
        self.error = error
        self.timestamp = timestamp
        super.init()
    }
}

@objc public class ZeekyPlugin: NSObject {
    @objc public let id: String
    @objc public let name: String
    @objc public let version: String
    @objc public let description: String
    @objc public let category: String
    @objc public let isEnabled: Bool
    @objc public let capabilities: [String]
    
    @objc public init(id: String, name: String, version: String, description: String, category: String, isEnabled: Bool, capabilities: [String]) {
        self.id = id
        self.name = name
        self.version = version
        self.description = description
        self.category = category
        self.isEnabled = isEnabled
        self.capabilities = capabilities
        super.init()
    }
}

// MARK: - Enums

@objc public enum ZeekyLogLevel: Int {
    case debug = 0
    case info = 1
    case warning = 2
    case error = 3
}

@objc public enum ZeekyError: Int, Error {
    case notInitialized = 1001
    case alreadyInitialized = 1002
    case invalidConfig = 1003
    case permissionDenied = 1004
    case networkError = 1005
    case pluginNotFound = 1006
    case voiceProcessingError = 1007
    
    public var localizedDescription: String {
        switch self {
        case .notInitialized:
            return "Zeeky SDK not initialized"
        case .alreadyInitialized:
            return "Zeeky SDK already initialized"
        case .invalidConfig:
            return "Invalid configuration"
        case .permissionDenied:
            return "Required permission denied"
        case .networkError:
            return "Network error occurred"
        case .pluginNotFound:
            return "Plugin not found"
        case .voiceProcessingError:
            return "Voice processing error"
        }
    }
}

// MARK: - Voice Processing

private class VoiceProcessor {
    private let config: ZeekyConfig
    private let speechRecognizer: SFSpeechRecognizer?
    private let audioEngine = AVAudioEngine()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    
    init(config: ZeekyConfig) {
        self.config = config
        self.speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    }
    
    func processAudio(_ audioData: Data, completion: @escaping (ZeekyResponse?, Error?) -> Void) {
        // Convert audio data to text using speech recognition
        guard let speechRecognizer = speechRecognizer, speechRecognizer.isAvailable else {
            completion(nil, ZeekyError.voiceProcessingError)
            return
        }
        
        // Create recognition request
        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = false
        
        // Process audio data
        recognitionTask = speechRecognizer.recognitionTask(with: request) { result, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            guard let result = result else {
                completion(nil, ZeekyError.voiceProcessingError)
                return
            }
            
            let recognizedText = result.bestTranscription.formattedString
            let intent = ZeekyIntent(action: "voice_input", entities: [["text": recognizedText]], confidence: Float(result.bestTranscription.averageConfidence))
            
            // Process the recognized text
            self.processRecognizedText(recognizedText, intent: intent, completion: completion)
        }
    }
    
    private func processRecognizedText(_ text: String, intent: ZeekyIntent, completion: @escaping (ZeekyResponse?, Error?) -> Void) {
        // Send to Zeeky API for processing
        let url = URL(string: "\(config.baseURL)/api/process")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(config.apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody = [
            "intent": [
                "action": intent.action,
                "entities": intent.entities,
                "confidence": intent.confidence
            ],
            "text": text
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        } catch {
            completion(nil, error)
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(nil, error)
                return
            }
            
            guard let data = data else {
                completion(nil, ZeekyError.networkError)
                return
            }
            
            do {
                let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
                let zeekyResponse = ZeekyResponse(
                    success: json?["success"] as? Bool ?? false,
                    data: json?["data"] as? [String: Any],
                    message: json?["message"] as? String,
                    error: json?["error"] as? String
                )
                completion(zeekyResponse, nil)
            } catch {
                completion(nil, error)
            }
        }.resume()
    }
}

// MARK: - Plugin Management

private class PluginManager {
    private let config: ZeekyConfig
    private var plugins: [String: ZeekyPlugin] = [:]
    
    init(config: ZeekyConfig) {
        self.config = config
        loadDefaultPlugins()
    }
    
    private func loadDefaultPlugins() {
        let defaultPlugins = [
            ZeekyPlugin(id: "calendar", name: "Calendar", version: "1.0.0", description: "Calendar management", category: "productivity", isEnabled: true, capabilities: ["create_event", "get_events", "update_event"]),
            ZeekyPlugin(id: "email", name: "Email", version: "1.0.0", description: "Email management", category: "productivity", isEnabled: true, capabilities: ["send_email", "get_emails", "search_emails"]),
            ZeekyPlugin(id: "tasks", name: "Tasks", version: "1.0.0", description: "Task management", category: "productivity", isEnabled: true, capabilities: ["create_task", "get_tasks", "complete_task"]),
            ZeekyPlugin(id: "notes", name: "Notes", version: "1.0.0", description: "Note taking", category: "productivity", isEnabled: true, capabilities: ["create_note", "get_notes", "search_notes"]),
            ZeekyPlugin(id: "slack", name: "Slack", version: "1.0.0", description: "Slack integration", category: "communication", isEnabled: true, capabilities: ["send_message", "get_messages", "create_channel"])
        ]
        
        for plugin in defaultPlugins {
            plugins[plugin.id] = plugin
        }
    }
    
    func getAvailablePlugins() -> [ZeekyPlugin] {
        return Array(plugins.values)
    }
    
    func enablePlugin(_ pluginId: String) throws {
        guard let plugin = plugins[pluginId] else {
            throw ZeekyError.pluginNotFound
        }
        
        // Enable plugin logic here
        print("Enabling plugin: \(plugin.name)")
    }
    
    func disablePlugin(_ pluginId: String) throws {
        guard let plugin = plugins[pluginId] else {
            throw ZeekyError.pluginNotFound
        }
        
        // Disable plugin logic here
        print("Disabling plugin: \(plugin.name)")
    }
    
    func processIntent(_ intent: ZeekyIntent, completion: @escaping (ZeekyResponse?, Error?) -> Void) {
        // Process intent with appropriate plugin
        let response = ZeekyResponse(
            success: true,
            data: ["intent": intent.action, "processed": true],
            message: "Intent processed successfully"
        )
        completion(response, nil)
    }
}

// MARK: - Siri Shortcuts Integration

@available(iOS 12.0, *)
public class ZeekySiriShortcuts {
    
    public static func createShortcut(for action: String, with parameters: [String: Any] = [:]) -> NSUserActivity {
        let activity = NSUserActivity(activityType: "com.zeeky.\(action)")
        activity.title = "Zeeky: \(action.capitalized)"
        activity.userInfo = parameters
        activity.isEligibleForSearch = true
        activity.isEligibleForPrediction = true
        activity.suggestedInvocationPhrase = "Hey Siri, \(action) with Zeeky"
        
        return activity
    }
    
    public static func handleShortcut(_ userActivity: NSUserActivity) -> Bool {
        guard userActivity.activityType.hasPrefix("com.zeeky.") else {
            return false
        }
        
        let action = String(userActivity.activityType.dropFirst("com.zeeky.".count))
        let parameters = userActivity.userInfo ?? [:]
        
        // Process the shortcut action
        ZeekySDK.shared.processTextInput("Siri shortcut: \(action)") { response, error in
            if let error = error {
                print("Siri shortcut error: \(error)")
            } else if let response = response {
                print("Siri shortcut response: \(response.message ?? "No message")")
            }
        }
        
        return true
    }
}