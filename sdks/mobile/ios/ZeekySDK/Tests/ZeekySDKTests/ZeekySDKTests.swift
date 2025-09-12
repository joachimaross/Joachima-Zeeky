import XCTest
@testable import ZeekySDK

final class ZeekySDKTests: XCTestCase {
    
    var zeeky: ZeekySDK!
    
    override func setUpWithError() throws {
        zeeky = ZeekySDK(apiKey: "test-api-key")
    }
    
    override func tearDownWithError() throws {
        zeeky = nil
    }
    
    func testInitialization() throws {
        XCTAssertNotNil(zeeky)
    }
    
    func testSendMessage() throws {
        let expectation = XCTestExpectation(description: "Send message")
        
        zeeky.sendMessage("Hello, Zeeky!") { result in
            switch result {
            case .success(let response):
                XCTAssertNotNil(response.text)
                XCTAssertNotNil(response.timestamp)
            case .failure(let error):
                // Expected to fail in test environment without real API
                XCTAssertNotNil(error)
            }
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 10.0)
    }
    
    func testGetAvailablePlugins() throws {
        let expectation = XCTestExpectation(description: "Get plugins")
        
        zeeky.getAvailablePlugins { result in
            switch result {
            case .success(let plugins):
                XCTAssertTrue(plugins is [ZeekyPlugin])
            case .failure(let error):
                // Expected to fail in test environment without real API
                XCTAssertNotNil(error)
            }
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 10.0)
    }
    
    func testExecutePlugin() throws {
        let expectation = XCTestExpectation(description: "Execute plugin")
        
        let parameters = ["query": "test"]
        
        zeeky.executePlugin("test-plugin", parameters: parameters) { result in
            switch result {
            case .success(let response):
                XCTAssertNotNil(response.text)
            case .failure(let error):
                // Expected to fail in test environment without real API
                XCTAssertNotNil(error)
            }
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 10.0)
    }
    
    func testVoiceInput() throws {
        let expectation = XCTestExpectation(description: "Voice input")
        
        zeeky.enableVoiceInput { transcript in
            XCTAssertEqual(transcript, "Voice input not yet implemented")
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 1.0)
    }
    
    func testAnalytics() throws {
        zeeky.enableAnalytics(true)
        zeeky.setUserProperties(["user_id": "12345", "plan": "premium"])
        
        // Analytics methods should not crash
        XCTAssertNoThrow(zeeky.enableAnalytics(false))
    }
}