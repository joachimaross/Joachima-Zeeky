# Zeeky Mobile SDKs

Native mobile SDKs for iOS and Android to integrate Zeeky AI Assistant capabilities into mobile applications.

## Features

- 🎯 **Native Integration** - Full native SDKs for iOS (Swift) and Android (Kotlin)
- 🧩 **Plugin Support** - Access to all Zeeky plugins and capabilities
- 🔊 **Voice Interface** - Speech-to-text and text-to-speech capabilities
- 📱 **Cross-Platform** - Consistent API across iOS and Android
- 🔒 **Secure** - End-to-end encryption and secure authentication
- 📊 **Analytics** - Built-in usage tracking and performance metrics

## Quick Start

### iOS (Swift)

```swift
import ZeekySDK

// Initialize the SDK
let zeeky = ZeekySDK(apiKey: "your-api-key")

// Send a text message
zeeky.sendMessage("What's the weather like?") { result in
    switch result {
    case .success(let response):
        print("Response: \(response.text)")
    case .failure(let error):
        print("Error: \(error)")
    }
}

// Enable voice input
zeeky.enableVoiceInput { transcript in
    print("Transcribed: \(transcript)")
}
```

### Android (Kotlin)

```kotlin
import com.zeeky.sdk.ZeekySDK

// Initialize the SDK
val zeeky = ZeekySDK(apiKey = "your-api-key")

// Send a text message
zeeky.sendMessage("What's the weather like?") { result ->
    when (result) {
        is Result.Success -> println("Response: ${result.data.text}")
        is Result.Failure -> println("Error: ${result.error}")
    }
}

// Enable voice input
zeeky.enableVoiceInput { transcript ->
    println("Transcribed: $transcript")
}
```

## Installation

### iOS

Add to your `Podfile`:

```ruby
pod 'ZeekySDK', '~> 1.0.0'
```

Or using Swift Package Manager:

```swift
dependencies: [
    .package(url: "https://github.com/zeeky/zeeky-ios-sdk.git", from: "1.0.0")
]
```

### Android

Add to your `build.gradle`:

```gradle
dependencies {
    implementation 'com.zeeky:zeeky-android-sdk:1.0.0'
}
```

## API Reference

### Core Methods

#### `initialize(apiKey: String)`
Initialize the SDK with your API key.

#### `sendMessage(text: String, completion: @escaping (Result<ZeekyResponse, ZeekyError>) -> Void)`
Send a text message to Zeeky and receive a response.

#### `enableVoiceInput(completion: @escaping (String) -> Void)`
Enable voice input and receive transcribed text.

#### `getAvailablePlugins(completion: @escaping (Result<[ZeekyPlugin], ZeekyError>) -> Void)`
Get list of available plugins.

#### `executePlugin(pluginId: String, parameters: [String: Any], completion: @escaping (Result<ZeekyResponse, ZeekyError>) -> Void)`
Execute a specific plugin with parameters.

### Data Models

#### ZeekyResponse
```swift
struct ZeekyResponse {
    let text: String
    let metadata: [String: Any]
    let timestamp: Date
    let pluginId: String?
}
```

#### ZeekyPlugin
```swift
struct ZeekyPlugin {
    let id: String
    let name: String
    let description: String
    let capabilities: [String]
    let version: String
}
```

## Configuration

### iOS

Add to your `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app uses the microphone for voice input with Zeeky.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app uses speech recognition for voice input with Zeeky.</string>
```

### Android

Add to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Error Handling

The SDK provides comprehensive error handling:

```swift
enum ZeekyError: Error {
    case invalidApiKey
    case networkError(Error)
    case pluginNotFound(String)
    case voiceInputNotAvailable
    case rateLimitExceeded
    case serverError(Int)
}
```

## Advanced Features

### Custom Plugins

Register custom plugins for your app:

```swift
let customPlugin = ZeekyPlugin(
    id: "my-plugin",
    name: "My Plugin",
    description: "Custom functionality",
    capabilities: ["custom-action"],
    version: "1.0.0"
)

zeeky.registerPlugin(customPlugin) { result in
    // Handle registration result
}
```

### Analytics

Track usage and performance:

```swift
zeeky.enableAnalytics(true)
zeeky.setUserProperties(["user_id": "12345", "plan": "premium"])
```

## Support

- 📖 [Documentation](https://docs.zeeky.ai/mobile-sdks)
- 🐛 [Issue Tracker](https://github.com/zeeky/zeeky-mobile-sdks/issues)
- 💬 [Community Discord](https://discord.gg/zeeky)
- 📧 [Email Support](mailto:support@zeeky.ai)

## License

MIT License - see LICENSE file for details