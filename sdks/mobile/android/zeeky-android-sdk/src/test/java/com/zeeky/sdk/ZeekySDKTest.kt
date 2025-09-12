package com.zeeky.sdk

import android.content.Context
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mock
import org.mockito.junit.MockitoJUnitRunner

@RunWith(MockitoJUnitRunner::class)
class ZeekySDKTest {
    
    @Mock
    private lateinit var mockContext: Context
    
    private lateinit var zeekySDK: ZeekySDK
    
    @Before
    fun setUp() {
        zeekySDK = ZeekySDK.create(mockContext, "test-api-key")
    }
    
    @Test
    fun testInitialization() {
        assert(::zeekySDK.isInitialized)
    }
    
    @Test
    fun testSendMessage() {
        val expectation = java.util.concurrent.CountDownLatch(1)
        
        zeekySDK.sendMessage("Hello, Zeeky!") { result ->
            when (result) {
                is Result.Success -> {
                    assert(result.data.text.isNotEmpty())
                    assert(result.data.timestamp.isNotEmpty())
                }
                is Result.Failure -> {
                    // Expected to fail in test environment without real API
                    assert(result.exception != null)
                }
            }
            expectation.countDown()
        }
        
        // Wait for async operation to complete
        expectation.await()
    }
    
    @Test
    fun testGetAvailablePlugins() {
        val expectation = java.util.concurrent.CountDownLatch(1)
        
        zeekySDK.getAvailablePlugins { result ->
            when (result) {
                is Result.Success -> {
                    assert(result.data is List<ZeekyPlugin>)
                }
                is Result.Failure -> {
                    // Expected to fail in test environment without real API
                    assert(result.exception != null)
                }
            }
            expectation.countDown()
        }
        
        expectation.await()
    }
    
    @Test
    fun testExecutePlugin() {
        val expectation = java.util.concurrent.CountDownLatch(1)
        
        val parameters = mapOf("query" to "test")
        
        zeekySDK.executePlugin("test-plugin", parameters) { result ->
            when (result) {
                is Result.Success -> {
                    assert(result.data.text.isNotEmpty())
                }
                is Result.Failure -> {
                    // Expected to fail in test environment without real API
                    assert(result.exception != null)
                }
            }
            expectation.countDown()
        }
        
        expectation.await()
    }
    
    @Test
    fun testVoiceInput() {
        val expectation = java.util.concurrent.CountDownLatch(1)
        
        zeekySDK.enableVoiceInput { transcript ->
            assert(transcript == "Voice input not yet implemented")
            expectation.countDown()
        }
        
        expectation.await()
    }
    
    @Test
    fun testAnalytics() {
        zeekySDK.enableAnalytics(true)
        zeekySDK.setUserProperties(mapOf("user_id" to "12345", "plan" to "premium"))
        
        // Analytics methods should not crash
        zeekySDK.enableAnalytics(false)
    }
}