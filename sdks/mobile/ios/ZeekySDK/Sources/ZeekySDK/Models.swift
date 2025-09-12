import Foundation

// MARK: - Response Models

/// Response from Zeeky API
public struct ZeekyResponse {
    public let text: String
    public let metadata: [String: Any]
    public let timestamp: Date
    public let pluginId: String?
    
    public init(text: String, metadata: [String: Any] = [:], timestamp: Date = Date(), pluginId: String? = nil) {
        self.text = text
        self.metadata = metadata
        self.timestamp = timestamp
        self.pluginId = pluginId
    }
}

/// Plugin information
public struct ZeekyPlugin {
    public let id: String
    public let name: String
    public let description: String
    public let capabilities: [String]
    public let version: String
    
    public init(id: String, name: String, description: String, capabilities: [String], version: String) {
        self.id = id
        self.name = name
        self.description = description
        self.capabilities = capabilities
        self.version = version
    }
}

// MARK: - Error Types

/// Zeeky SDK error types
public enum ZeekyError: Error, LocalizedError {
    case invalidApiKey
    case networkError(Error)
    case pluginNotFound(String)
    case voiceInputNotAvailable
    case rateLimitExceeded
    case serverError(Int)
    case parsingError
    case featureNotAvailable
    case unknown
    
    public var errorDescription: String? {
        switch self {
        case .invalidApiKey:
            return "Invalid API key provided"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .pluginNotFound(let pluginId):
            return "Plugin not found: \(pluginId)"
        case .voiceInputNotAvailable:
            return "Voice input is not available on this device"
        case .rateLimitExceeded:
            return "Rate limit exceeded. Please try again later."
        case .serverError(let code):
            return "Server error with status code: \(code)"
        case .parsingError:
            return "Error parsing server response"
        case .featureNotAvailable:
            return "This feature is not yet available"
        case .unknown:
            return "An unknown error occurred"
        }
    }
}

// MARK: - Configuration

/// SDK Configuration
public struct ZeekyConfiguration {
    public let apiKey: String
    public let baseURL: String
    public let timeout: TimeInterval
    public let retryCount: Int
    public let enableAnalytics: Bool
    
    public init(
        apiKey: String,
        baseURL: String = "https://api.zeeky.ai",
        timeout: TimeInterval = 30.0,
        retryCount: Int = 3,
        enableAnalytics: Bool = true
    ) {
        self.apiKey = apiKey
        self.baseURL = baseURL
        self.timeout = timeout
        self.retryCount = retryCount
        self.enableAnalytics = enableAnalytics
    }
}