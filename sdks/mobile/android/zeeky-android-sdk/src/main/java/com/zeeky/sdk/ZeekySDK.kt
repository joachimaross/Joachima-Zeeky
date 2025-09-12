package com.zeeky.sdk

import android.content.Context
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.Date

/**
 * Main Zeeky SDK class for Android
 */
class ZeekySDK private constructor(
    private val context: Context,
    private val apiKey: String,
    private val baseUrl: String
) {
    
    private val retrofit: Retrofit
    private val apiService: ZeekyApiService
    private var analyticsEnabled: Boolean = false
    private var userProperties: Map<String, String> = emptyMap()
    
    init {
        retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        
        apiService = retrofit.create(ZeekyApiService::class.java)
    }
    
    companion object {
        private const val DEFAULT_BASE_URL = "https://api.zeeky.ai"
        
        fun create(
            context: Context,
            apiKey: String,
            baseUrl: String = DEFAULT_BASE_URL
        ): ZeekySDK {
            return ZeekySDK(context, apiKey, baseUrl)
        }
    }
    
    /**
     * Send a text message to Zeeky
     */
    fun sendMessage(
        text: String,
        callback: (Result<ZeekyResponse>) -> Unit
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = MessageRequest(
                    message = text,
                    timestamp = Date().toString()
                )
                
                val response = apiService.sendMessage(
                    authorization = "Bearer $apiKey",
                    request = request
                )
                
                withContext(Dispatchers.Main) {
                    callback(Result.success(response))
                }
                
                if (analyticsEnabled) {
                    trackEvent("message_sent", mapOf("message_length" to text.length.toString()))
                }
                
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    callback(Result.failure(e))
                }
            }
        }
    }
    
    /**
     * Get available plugins
     */
    fun getAvailablePlugins(
        callback: (Result<List<ZeekyPlugin>>) -> Unit
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = apiService.getPlugins(authorization = "Bearer $apiKey")
                
                withContext(Dispatchers.Main) {
                    callback(Result.success(response.plugins))
                }
                
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    callback(Result.failure(e))
                }
            }
        }
    }
    
    /**
     * Execute a specific plugin
     */
    fun executePlugin(
        pluginId: String,
        parameters: Map<String, Any>,
        callback: (Result<ZeekyResponse>) -> Unit
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val request = PluginExecuteRequest(
                    pluginId = pluginId,
                    parameters = parameters,
                    timestamp = Date().toString()
                )
                
                val response = apiService.executePlugin(
                    authorization = "Bearer $apiKey",
                    request = request
                )
                
                withContext(Dispatchers.Main) {
                    callback(Result.success(response))
                }
                
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    callback(Result.failure(e))
                }
            }
        }
    }
    
    /**
     * Enable voice input (placeholder for future implementation)
     */
    fun enableVoiceInput(callback: (String) -> Unit) {
        // TODO: Implement speech recognition
        callback("Voice input not yet implemented")
    }
    
    /**
     * Synthesize speech from text (placeholder for future implementation)
     */
    fun synthesizeSpeech(
        text: String,
        callback: (Result<ByteArray>) -> Unit
    ) {
        // TODO: Implement text-to-speech
        callback(Result.failure(Exception("Feature not yet implemented")))
    }
    
    /**
     * Enable analytics tracking
     */
    fun enableAnalytics(enabled: Boolean) {
        this.analyticsEnabled = enabled
    }
    
    /**
     * Set user properties for analytics
     */
    fun setUserProperties(properties: Map<String, String>) {
        this.userProperties = properties
    }
    
    /**
     * Track a custom event
     */
    private fun trackEvent(eventName: String, properties: Map<String, String> = emptyMap()) {
        if (!analyticsEnabled) return
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val eventData = AnalyticsEvent(
                    event = eventName,
                    properties = properties,
                    userProperties = userProperties,
                    timestamp = Date().toString()
                )
                
                apiService.trackEvent(
                    authorization = "Bearer $apiKey",
                    event = eventData
                )
            } catch (e: Exception) {
                // Analytics tracking is fire-and-forget
            }
        }
    }
}

/**
 * API service interface
 */
interface ZeekyApiService {
    
    @POST("v1/messages")
    suspend fun sendMessage(
        @Header("Authorization") authorization: String,
        @Body request: MessageRequest
    ): ZeekyResponse
    
    @GET("v1/plugins")
    suspend fun getPlugins(
        @Header("Authorization") authorization: String
    ): PluginsResponse
    
    @POST("v1/plugins/execute")
    suspend fun executePlugin(
        @Header("Authorization") authorization: String,
        @Body request: PluginExecuteRequest
    ): ZeekyResponse
    
    @POST("v1/analytics/track")
    suspend fun trackEvent(
        @Header("Authorization") authorization: String,
        @Body event: AnalyticsEvent
    )
}

/**
 * Data classes
 */
data class MessageRequest(
    val message: String,
    val timestamp: String
)

data class PluginExecuteRequest(
    val pluginId: String,
    val parameters: Map<String, Any>,
    val timestamp: String
)

data class ZeekyResponse(
    val text: String,
    val metadata: Map<String, Any> = emptyMap(),
    val timestamp: String = Date().toString(),
    val pluginId: String? = null
)

data class ZeekyPlugin(
    val id: String,
    val name: String,
    val description: String,
    val capabilities: List<String>,
    val version: String
)

data class PluginsResponse(
    val plugins: List<ZeekyPlugin>
)

data class AnalyticsEvent(
    val event: String,
    val properties: Map<String, String> = emptyMap(),
    val userProperties: Map<String, String> = emptyMap(),
    val timestamp: String
)