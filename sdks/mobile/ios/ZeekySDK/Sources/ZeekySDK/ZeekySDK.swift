import Foundation
import Alamofire
import SwiftyJSON

/// Main Zeeky SDK class for iOS
public class ZeekySDK {
    
    // MARK: - Properties
    
    private let apiKey: String
    private let baseURL: String
    private let session: Session
    private var analyticsEnabled: Bool = false
    private var userProperties: [String: String] = [:]
    
    // MARK: - Initialization
    
    /// Initialize the Zeeky SDK
    /// - Parameters:
    ///   - apiKey: Your Zeeky API key
    ///   - baseURL: Base URL for the Zeeky API (optional, defaults to production)
    public init(apiKey: String, baseURL: String = "https://api.zeeky.ai") {
        self.apiKey = apiKey
        self.baseURL = baseURL
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        
        self.session = Session(configuration: configuration)
    }
    
    // MARK: - Core Methods
    
    /// Send a text message to Zeeky
    /// - Parameters:
    ///   - text: The message text
    ///   - completion: Completion handler with result
    public func sendMessage(_ text: String, completion: @escaping (Result<ZeekyResponse, ZeekyError>) -> Void) {
        let parameters: [String: Any] = [
            "message": text,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
        
        let headers: HTTPHeaders = [
            "Authorization": "Bearer \(apiKey)",
            "Content-Type": "application/json"
        ]
        
        session.request(
            "\(baseURL)/v1/messages",
            method: .post,
            parameters: parameters,
            encoding: JSONEncoding.default,
            headers: headers
        ).validate().responseData { [weak self] response in
            switch response.result {
            case .success(let data):
                do {
                    let json = try JSON(data: data)
                    let zeekyResponse = try self?.parseResponse(json) ?? ZeekyResponse(text: "Error parsing response")
                    completion(.success(zeekyResponse))
                    
                    if self?.analyticsEnabled == true {
                        self?.trackEvent("message_sent", properties: ["message_length": text.count])
                    }
                } catch {
                    completion(.failure(.parsingError))
                }
            case .failure(let error):
                completion(.failure(.networkError(error)))
            }
        }
    }
    
    /// Get available plugins
    /// - Parameter completion: Completion handler with result
    public func getAvailablePlugins(completion: @escaping (Result<[ZeekyPlugin], ZeekyError>) -> Void) {
        let headers: HTTPHeaders = [
            "Authorization": "Bearer \(apiKey)"
        ]
        
        session.request(
            "\(baseURL)/v1/plugins",
            method: .get,
            headers: headers
        ).validate().responseData { response in
            switch response.result {
            case .success(let data):
                do {
                    let json = try JSON(data: data)
                    let plugins = try self.parsePlugins(json)
                    completion(.success(plugins))
                } catch {
                    completion(.failure(.parsingError))
                }
            case .failure(let error):
                completion(.failure(.networkError(error)))
            }
        }
    }
    
    /// Execute a specific plugin
    /// - Parameters:
    ///   - pluginId: The plugin ID to execute
    ///   - parameters: Parameters for the plugin
    ///   - completion: Completion handler with result
    public func executePlugin(_ pluginId: String, parameters: [String: Any], completion: @escaping (Result<ZeekyResponse, ZeekyError>) -> Void) {
        let requestBody: [String: Any] = [
            "plugin_id": pluginId,
            "parameters": parameters,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
        
        let headers: HTTPHeaders = [
            "Authorization": "Bearer \(apiKey)",
            "Content-Type": "application/json"
        ]
        
        session.request(
            "\(baseURL)/v1/plugins/execute",
            method: .post,
            parameters: requestBody,
            encoding: JSONEncoding.default,
            headers: headers
        ).validate().responseData { response in
            switch response.result {
            case .success(let data):
                do {
                    let json = try JSON(data: data)
                    let zeekyResponse = try self.parseResponse(json)
                    completion(.success(zeekyResponse))
                } catch {
                    completion(.failure(.parsingError))
                }
            case .failure(let error):
                completion(.failure(.networkError(error)))
            }
        }
    }
    
    // MARK: - Voice Interface
    
    /// Enable voice input (placeholder for future implementation)
    /// - Parameter completion: Completion handler with transcribed text
    public func enableVoiceInput(completion: @escaping (String) -> Void) {
        // TODO: Implement speech recognition
        completion("Voice input not yet implemented")
    }
    
    /// Synthesize speech from text (placeholder for future implementation)
    /// - Parameters:
    ///   - text: Text to synthesize
    ///   - completion: Completion handler with audio data
    public func synthesizeSpeech(_ text: String, completion: @escaping (Result<Data, ZeekyError>) -> Void) {
        // TODO: Implement text-to-speech
        completion(.failure(.featureNotAvailable))
    }
    
    // MARK: - Analytics
    
    /// Enable analytics tracking
    /// - Parameter enabled: Whether to enable analytics
    public func enableAnalytics(_ enabled: Bool) {
        self.analyticsEnabled = enabled
    }
    
    /// Set user properties for analytics
    /// - Parameter properties: User properties dictionary
    public func setUserProperties(_ properties: [String: String]) {
        self.userProperties = properties
    }
    
    /// Track a custom event
    /// - Parameters:
    ///   - eventName: Name of the event
    ///   - properties: Event properties
    private func trackEvent(_ eventName: String, properties: [String: Any] = [:]) {
        guard analyticsEnabled else { return }
        
        let eventData: [String: Any] = [
            "event": eventName,
            "properties": properties,
            "user_properties": userProperties,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
        
        let headers: HTTPHeaders = [
            "Authorization": "Bearer \(apiKey)",
            "Content-Type": "application/json"
        ]
        
        session.request(
            "\(baseURL)/v1/analytics/track",
            method: .post,
            parameters: eventData,
            encoding: JSONEncoding.default,
            headers: headers
        ).response { _ in
            // Analytics tracking is fire-and-forget
        }
    }
    
    // MARK: - Private Methods
    
    private func parseResponse(_ json: JSON) throws -> ZeekyResponse {
        let text = json["response"]["text"].stringValue
        let metadata = json["response"]["metadata"].dictionaryObject ?? [:]
        let timestamp = Date()
        let pluginId = json["response"]["plugin_id"].string
        
        return ZeekyResponse(
            text: text,
            metadata: metadata,
            timestamp: timestamp,
            pluginId: pluginId
        )
    }
    
    private func parsePlugins(_ json: JSON) throws -> [ZeekyPlugin] {
        var plugins: [ZeekyPlugin] = []
        
        for (_, pluginJson) in json["plugins"] {
            let plugin = ZeekyPlugin(
                id: pluginJson["id"].stringValue,
                name: pluginJson["name"].stringValue,
                description: pluginJson["description"].stringValue,
                capabilities: pluginJson["capabilities"].arrayObject as? [String] ?? [],
                version: pluginJson["version"].stringValue
            )
            plugins.append(plugin)
        }
        
        return plugins
    }
}